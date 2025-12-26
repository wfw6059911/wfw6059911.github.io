import { lazy, Suspense, ComponentType } from 'react';

// 动态导入工具组件，减少初始加载体积
const TimestampConverter = lazy(() => import('./TimestampConverter'));
const BaiduHotSearch = lazy(() => import('./BaiduHotSearch'));
const IpLocation = lazy(() => import('./IpLocation'));
const ImageToIco = lazy(() => import('./ImageToIco'));
const EncodeTool = lazy(() => import('./EncodeTool'));
const Md5Tool = lazy(() => import('./Md5Tool'));
const CountryCodeTool = lazy(() => import('./CountryCodeTool'));
const ImageGenerator = lazy(() => import('./ImageGenerator'));
const PasswordGenerator = lazy(() => import('./PasswordGenerator'));
const UserAgentParser = lazy(() => import('./UserAgentParser'));
const GameNameGenerator = lazy(() => import('./GameNameGenerator'));

// 加载占位组件
const LoadingFallback = () => (
  <div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>
);

// 包装懒加载组件
const withSuspense = (Component: ComponentType) => {
  return function WrappedComponent(props: Record<string, unknown>) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

// 工具组件注册表
// 添加新工具时，只需在这里注册即可
export const toolComponents: Record<string, ComponentType> = {
  'timestamp-converter': withSuspense(TimestampConverter),
  'baidu-hot-search': withSuspense(BaiduHotSearch),
  'ip-location': withSuspense(IpLocation),
  'image-to-ico': withSuspense(ImageToIco),
  'encode-tool': withSuspense(EncodeTool),
  'md5-tool': withSuspense(Md5Tool),
  'country-code-tool': withSuspense(CountryCodeTool),
  'image-generator': withSuspense(ImageGenerator),
  'password-generator': withSuspense(PasswordGenerator),
  'user-agent-parser': withSuspense(UserAgentParser),
  'game-name-generator': withSuspense(GameNameGenerator),
};

// 根据 componentId 获取工具组件
export function getToolComponent(componentId: string): ComponentType | null {
  return toolComponents[componentId] || null;
}
