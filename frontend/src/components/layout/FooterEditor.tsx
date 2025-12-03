import { useState, useCallback } from 'react';
import type { FooterConfig, FooterLinkItem, FooterSocialLink } from '../../types/layout';

interface FooterEditorProps {
  config: FooterConfig;
  onChange: (config: FooterConfig) => void;
}

/**
 * 푸터 편집 컴포넌트
 * 테넌트 관리자가 푸터를 설정할 수 있는 UI
 */
export function FooterEditor({ config, onChange }: FooterEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'links' | 'social'>('basic');

  // 기본 정보 업데이트
  const updateBasicInfo = useCallback(
    (updates: Partial<FooterConfig>) => {
      onChange({ ...config, ...updates });
    },
    [config, onChange]
  );

  // 링크 추가
  const addLink = useCallback(() => {
    const newLink: FooterLinkItem = {
      id: `link-${Date.now()}`,
      label: 'New Link',
      url: '#',
      enabled: true,
      order: config.links.length + 1,
    };
    onChange({ ...config, links: [...config.links, newLink] });
  }, [config, onChange]);

  // 링크 삭제
  const removeLink = useCallback(
    (linkId: string) => {
      const newLinks = config.links.filter((l) => l.id !== linkId);
      onChange({ ...config, links: newLinks });
    },
    [config, onChange]
  );

  // 링크 업데이트
  const updateLink = useCallback(
    (linkId: string, updates: Partial<FooterLinkItem>) => {
      const newLinks = config.links.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      );
      onChange({ ...config, links: newLinks });
    },
    [config, onChange]
  );

  // 소셜 링크 추가
  const addSocialLink = useCallback(() => {
    const newSocialLink: FooterSocialLink = {
      id: `social-${Date.now()}`,
      platform: 'other',
      url: '#',
      enabled: true,
    };
    onChange({ ...config, socialLinks: [...config.socialLinks, newSocialLink] });
  }, [config, onChange]);

  // 소셜 링크 삭제
  const removeSocialLink = useCallback(
    (linkId: string) => {
      const newSocialLinks = config.socialLinks.filter((l) => l.id !== linkId);
      onChange({ ...config, socialLinks: newSocialLinks });
    },
    [config, onChange]
  );

  // 소셜 링크 업데이트
  const updateSocialLink = useCallback(
    (linkId: string, updates: Partial<FooterSocialLink>) => {
      const newSocialLinks = config.socialLinks.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      );
      onChange({ ...config, socialLinks: newSocialLinks });
    },
    [config, onChange]
  );

  return (
    <div className="space-y-6">
      {/* 푸터 활성화 토글 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">푸터 활성화</h4>
          <p className="text-sm text-gray-500">모든 페이지 하단에 푸터를 표시합니다</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateBasicInfo({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {config.enabled && (
        <>
          {/* 탭 네비게이션 */}
          <div className="flex gap-2 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              기본 정보
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'links'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              링크 관리
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'social'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              소셜 링크
            </button>
          </div>

          {/* 기본 정보 탭 */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">회사명</span>
                  <input
                    type="text"
                    value={config.companyName || ''}
                    onChange={(e) => updateBasicInfo({ companyName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="회사 이름"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">이메일</span>
                  <input
                    type="email"
                    value={config.email || ''}
                    onChange={(e) => updateBasicInfo({ email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="contact@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">전화번호</span>
                  <input
                    type="tel"
                    value={config.phone || ''}
                    onChange={(e) => updateBasicInfo({ phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="02-1234-5678"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">주소</span>
                  <input
                    type="text"
                    value={config.address || ''}
                    onChange={(e) => updateBasicInfo({ address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="서울시 강남구..."
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">회사 설명</span>
                <textarea
                  value={config.companyDescription || ''}
                  onChange={(e) => updateBasicInfo({ companyDescription: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="회사 소개"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">저작권 문구</span>
                <input
                  type="text"
                  value={config.copyrightText || ''}
                  onChange={(e) => updateBasicInfo({ copyrightText: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="© 2024 Company Name. All rights reserved."
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">배경색</span>
                  <input
                    type="color"
                    value={config.backgroundColor || '#1f2937'}
                    onChange={(e) => updateBasicInfo({ backgroundColor: e.target.value })}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">텍스트 색상</span>
                  <input
                    type="color"
                    value={config.textColor || '#ffffff'}
                    onChange={(e) => updateBasicInfo({ textColor: e.target.value })}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => updateBasicInfo({ showLogo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">로고 표시</span>
              </label>
            </div>
          )}

          {/* 링크 관리 탭 */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">링크 목록</h4>
                <button
                  onClick={addLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + 링크 추가
                </button>
              </div>

              <div className="space-y-3">
                {config.links.map((link) => (
                  <div key={link.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateLink(link.id, { enabled: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">활성화</span>
                      </label>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(link.id, { label: e.target.value })}
                        placeholder="링크 텍스트"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        placeholder="https://example.com"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}

                {config.links.length === 0 && (
                  <p className="text-center text-gray-500 py-8">링크가 없습니다</p>
                )}
              </div>
            </div>
          )}

          {/* 소셜 링크 탭 */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">소셜 미디어 링크</h4>
                <button
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + 소셜 링크 추가
                </button>
              </div>

              <div className="space-y-3">
                {config.socialLinks.map((link) => (
                  <div key={link.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) =>
                            updateSocialLink(link.id, { enabled: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">활성화</span>
                      </label>
                      <button
                        onClick={() => removeSocialLink(link.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(link.id, {
                            platform: e.target.value as FooterSocialLink['platform'],
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}

                {config.socialLinks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">소셜 링크가 없습니다</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
