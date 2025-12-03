import { useFooter } from '../../hooks/useFooter';
import { useTenant } from '../../contexts/TenantContext';

/**
 * 소셜 미디어 플랫폼별 아이콘
 */
const SOCIAL_ICONS: Record<string, string> = {
  facebook: '📘',
  twitter: '🐦',
  instagram: '📷',
  linkedin: '💼',
  youtube: '📺',
  github: '💻',
  other: '🔗',
};

/**
 * 테넌트별 푸터 컴포넌트
 */
export function TenantFooter() {
  const { footerConfig, visibleLinks, visibleSocialLinks, isEnabled } = useFooter();
  const { branding } = useTenant();

  if (!isEnabled) return null;

  return (
    <footer
      style={{
        backgroundColor: footerConfig.backgroundColor,
        color: footerConfig.textColor,
      }}
      className="mt-auto border-t"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            {footerConfig.showLogo && branding?.logoUrl && (
              <img
                src={branding.logoUrl}
                alt={footerConfig.companyName || 'Company Logo'}
                className="h-8 mb-4"
              />
            )}
            {footerConfig.companyName && (
              <h3 className="text-lg font-semibold mb-2">{footerConfig.companyName}</h3>
            )}
            {footerConfig.companyDescription && (
              <p className="text-sm opacity-80 mb-4">{footerConfig.companyDescription}</p>
            )}
            {footerConfig.address && (
              <p className="text-sm opacity-70 mb-1">📍 {footerConfig.address}</p>
            )}
            {footerConfig.phone && (
              <p className="text-sm opacity-70 mb-1">📞 {footerConfig.phone}</p>
            )}
            {footerConfig.email && (
              <p className="text-sm opacity-70">✉️ {footerConfig.email}</p>
            )}
          </div>

          {/* 링크 목록 */}
          {visibleLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {visibleLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 소셜 링크 */}
          {visibleSocialLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {visibleSocialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl opacity-80 hover:opacity-100 transition-opacity"
                    title={link.platform}
                  >
                    {SOCIAL_ICONS[link.platform]}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 저작권 정보 */}
        {footerConfig.copyrightText && (
          <div className="mt-8 pt-6 border-t border-current opacity-50">
            <p className="text-sm text-center">{footerConfig.copyrightText}</p>
          </div>
        )}
      </div>
    </footer>
  );
}
