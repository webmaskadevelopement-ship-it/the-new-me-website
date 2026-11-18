#!/usr/bin/env python3
"""Deterministic HTML transforms for the_new_me_website.
Safe to re-run; each transform is idempotent."""
import os, re, sys, html

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
DOMAIN = "https://thenewme.com"
TW_LINK = '<link rel="stylesheet" href="vendor/tailwind.prod.css">'

def each_page():
    return sorted(f for f in os.listdir(ROOT) if f.endswith(".html"))

# ---------- 1. Tailwind CDN -> static compiled CSS ----------
TW_SILENCER = re.compile(
    r"<script>\s*// Silence Tailwind Play CDN development advisory in browser console.*?</script>",
    re.S,
)
TW_CDN = re.compile(
    r'<script src="https://cdn\.tailwindcss\.com\?plugins=forms,container-queries"></script>\s*'
)
TW_CONFIG = re.compile(r"<script id=\"tailwind-config\">tailwind\.config = .*?</script>", re.S)
STYLE_CSS_LINK = re.compile(r'(<link rel="stylesheet" href="style\.css[^"]*">)')

# ---------- 2. canonical ----------
def add_canonical(src, page):
    if 'rel="canonical"' in src:
        return src
    canon = f'<link rel="canonical" href="{DOMAIN}/{page}">\n'
    return src.replace("</head>", canon + "</head>", 1)

# ---------- 3. Open Graph + Twitter ----------
OG_DEFAULTS = {
    "index.html": ("The New Me - Reverse Aging & Rebuild Health",
                   "Practical science. Real habits. A longer, healthier, happier you. Discover The New Me 2.0 guide to reverse aging.",
                   "website"),
    "about.html": ("About Us | The New Me",
                   "Discover The New Me, a science-backed lifestyle initiative dedicated to healthy longevity, reverse aging, whole plant nutrition, and daily vitality.",
                   "website"),
    "blog.html": ("Blog | The New Me",
                  "Science-backed nutrition, intuitive movement, and mindful living curated for your everyday sustainable transformation.",
                  "website"),
    "contact.html": ("Contact Us | The New Me",
                     "Reach out to The New Me team for inquiries, book orders, press requests, and guidance on whole plant-based nutrition and wellness.",
                     "website"),
    "protein-powder.html": ("Protein Powder | The New Me",
                            "Experience The New Me plant-based protein powder: complete tri-blend, prebiotic fibre, active B12, and zero bloat.",
                            "product"),
}

def inject_og(src, page):
    if "property=\"og:title\"" in src:
        return src
    t, d, typ = OG_DEFAULTS.get(page, (None, None, "article"))
    if t is None:
        m = re.search(r"<title>(.*?)</title>", src, re.S)
        t = (m.group(1).strip() if m else "The New Me")
        m = re.search(r'<meta name="description" content="([^"]*)"', src)
        d = (m.group(1) if m else t)
    # fallback og:image = first local webp image used in the page
    im = re.search(r'src="(DATA/[^"]+\.webp|images/[^"]+\.webp)"', src)
    og_img = f"{DOMAIN}/{im.group(1)}" if im else f"{DOMAIN}/DATA/The New Me Heart Logo.webp"
    block = (
        f'<meta property="og:site_name" content="The New Me">\n'
        f'<meta property="og:title" content="{html.escape(t)}">\n'
        f'<meta property="og:description" content="{html.escape(d)}">\n'
        f'<meta property="og:type" content="{typ}">\n'
        f'<meta property="og:url" content="{DOMAIN}/{page}">\n'
        f'<meta property="og:image" content="{og_img}">\n'
        f'<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{html.escape(t)}">\n'
    )
    return src.replace("</head>", block + "</head>", 1)

# ---------- 4. workout-tight-schedule missing title/description ----------
def fix_workout_title(src):
    if "<title>" in src:
        return src
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", src, re.S)
    title = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else "Workout in a Tight Schedule | The New Me"
    first_p = re.search(r"<p[^>]*>(.*?)</p>", src, re.S)
    desc = re.sub(r"<[^>]+>", "", first_p.group(1)).strip()[:150] if first_p else title
    head = f"<title>{title}</title>\n    <meta name=\"description\" content=\"{html.escape(desc)}\">\n"
    return src.replace("</head>", head + "</head>", 1)

# ---------- 5. contact form -> Netlify AJAX submission (same UI) ----------
CONTACT_HANDLER_OLD = re.compile(
    r"if \(contactForm\) \{.*?contactForm\.addEventListener\('submit', function\(e\) \{.*?\n\s*\}\);\n\s*\}\n",
    re.S,
)
CONTACT_HANDLER_NEW = """            if (contactForm) {
                // Netlify Forms AJAX submission (silent, keeps same UI)
                const botField = contactForm.querySelector('[name="bot-field"]');
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if (botField && botField.value) return; // honeypot triggered
                    const formData = new FormData(contactForm);
                    formData.append('form-name', 'contact');
                    fetch('/', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
                        .then(function () {
                            if (contactFields && contactSuccess) {
                                contactFields.style.display = 'none';
                                contactSuccess.style.display = 'block';
                                contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        })
                        .catch(function () {
                            if (contactFields && contactSuccess) {
                                contactFields.style.display = 'none';
                                contactSuccess.style.display = 'block';
                                contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                });
            }

"""
HONEYPOT = re.compile(r'(<form id="contactForm"[^>]*>)')

def wire_contact_form(src):
    src, n = CONTACT_HANDLER_OLD.subn(CONTACT_HANDLER_NEW, src, count=1)
    if "name=\"bot-field\"" not in src:
        src, n2 = HONEYPOT.subn(
            lambda m: m.group(1) + (
                '\n                    <input type="text" name="bot-field" value="" '
                'aria-hidden="true" tabindex="-1" autocomplete="off" '
                'style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">'
            ),
            src, count=1,
        )
        n += n2
    return src, n

# ---------- 6. local <img> width/height + lazy (missing only) ----------
from PIL import Image
IMG_TAG = re.compile(r'<img(?![^>]*width=)[^>]*>')

def add_img_dims(src, page):
    def fix(m):
        tag = m.group(0)
        if 'loading="lazy"' not in tag:
            tag = tag[:-1] + ' loading="lazy">'
        m_src = re.search(r'src="([^"]+)"', tag)
        if not m_src:
            return tag
        p = m_src.group(1).split("?")[0]
        full = os.path.join(ROOT, p)
        if not os.path.exists(full):
            return tag
        try:
            with Image.open(full) as im:
                w, h = im.size
        except Exception:
            return tag
        return tag[:-1] + f' width="{w}" height="{h}">'
    return IMG_TAG.sub(fix, src)

def main():
    for page in each_page():
        path = os.path.join(ROOT, page)
        src = open(path, encoding="utf-8").read()
        orig = src
        src = add_canonical(src, page)
        src = inject_og(src, page)
        src = fix_workout_title(src)
        if page in ("contact.html",):
            src, _ = wire_contact_form(src)
        if "cdn.tailwindcss.com" in src:
            src = TW_SILENCER.sub("", src)
            src = TW_CDN.sub("", src)
            src = TW_CONFIG.sub("", src)
            if "vendor/tailwind.prod.css" not in src:
                src = STYLE_CSS_LINK.sub(lambda m: m.group(1) + "\n    " + TW_LINK, src, count=1)
        if page in ("index.html", "about.html", "blog.html", "contact.html", "protein-powder.html"):
            src = add_img_dims(src, page)
        if src != orig:
            open(path, "w", encoding="utf-8").write(src)
            print(f"  updated {page}")
        else:
            print(f"  unchanged {page}")

if __name__ == "__main__":
    main()
