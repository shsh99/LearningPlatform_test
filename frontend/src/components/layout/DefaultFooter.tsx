/**
 * 기본 푸터 컴포넌트
 * TenantFooter가 비활성화된 경우 표시되는 기본 푸터
 */
export function DefaultFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-gray-800 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 서비스 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learning Platform</h3>
            <p className="text-sm text-gray-300">
              온라인 학습을 위한 통합 플랫폼
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm text-gray-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/documentation" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-center text-gray-400">
            © {currentYear} Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
