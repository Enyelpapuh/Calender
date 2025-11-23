from django import template
from django.templatetags.static import static
from django.conf import settings
import glob
import os

register = template.Library()


def _search_asset(pattern):
    """Search for the first file matching pattern in likely build locations.

    pattern: glob pattern like 'index-*.js' or 'index-*.css'
    Returns the filename (not full path) or None.
    """
    candidates = [
        settings.BASE_DIR / 'staticfiles_collected' / 'dist' / 'assets',
        settings.BASE_DIR / 'static' / 'dist' / 'assets',
    ]
    # FRONTEND_DIR may point to frontend/Calender
    try:
        if getattr(settings, 'FRONTEND_DIR', None):
            candidates.append(settings.FRONTEND_DIR / 'dist' / 'assets')
    except Exception:
        pass

    for d in candidates:
        try:
            dstr = str(d)
            if not os.path.isdir(dstr):
                continue
            matches = glob.glob(os.path.join(dstr, pattern))
            if matches:
                return os.path.basename(matches[0])
        except Exception:
            continue

    return None


@register.simple_tag
def vite_asset_js():
    """Return static URL for the built JS file (index-*.js) or empty string."""
    filename = _search_asset('index-*.js')
    if not filename:
        return ''
    return static(f'dist/assets/{filename}')


@register.simple_tag
def vite_asset_css():
    """Return static URL for the built CSS file (index-*.css) or empty string."""
    filename = _search_asset('index-*.css')
    if not filename:
        return ''
    return static(f'dist/assets/{filename}')
