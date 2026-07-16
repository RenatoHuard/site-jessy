import { useState, useEffect } from 'react';
import { dbGet } from '@/lib/dbClient';

function hexToHSL(hex) {
  if (!hex) return null;
  hex = hex.replace(/#/g, '');
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function getContrastForeground(hex) {
  if (!hex) return '0 0% 98%';
  hex = hex.replace(/#/g, '');
  if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '240 5.9% 10%' : '0 0% 98%';
}

export function useSiteConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const records = await dbGet('site_config');
        const record = records?.[0];
        if (!record) return;

        setConfig(record);

        if (record.primary_color) {
          document.documentElement.style.setProperty('--primary', hexToHSL(record.primary_color));
          document.documentElement.style.setProperty('--primary-foreground', getContrastForeground(record.primary_color));
        }
        if (record.secondary_color) {
          document.documentElement.style.setProperty('--secondary', hexToHSL(record.secondary_color));
          document.documentElement.style.setProperty('--secondary-foreground', getContrastForeground(record.secondary_color));
        }
        if (record.accent_color) {
          document.documentElement.style.setProperty('--accent', hexToHSL(record.accent_color));
          document.documentElement.style.setProperty('--accent-foreground', getContrastForeground(record.accent_color));
          document.documentElement.style.setProperty('--ring', hexToHSL(record.accent_color));
        }
      } catch (error) {
        console.error('Error fetching site config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
}
