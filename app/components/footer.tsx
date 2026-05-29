import { Link } from "react-router";

const columns = [
  {
    title: "服务项目",
    links: [
      { label: "定制开发", href: "/" },
      { label: "UI 设计", href: "/" },
      { label: "后端架构", href: "/" },
      { label: "小程序开发", href: "/" },
    ],
  },
  {
    title: "关于我们",
    links: [
      { label: "团队介绍", href: "/" },
      { label: "案例展示", href: "/" },
      { label: "开发流程", href: "/" },
    ],
  },
  {
    title: "帮助支持",
    links: [
      { label: "常见问题", href: "/" },
      { label: "服务条款", href: "/" },
      { label: "隐私政策", href: "/" },
    ],
  },
  {
    title: "联系我们",
    links: [
      { label: "hi@aidev.cn", href: "XXX" },
      { label: "微信公众号：XXX", href: "/" },
      { label: "XX · XXX", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full font-MiSans"
      style={{ backgroundColor: "#f5f5f7", padding: "64px 0" }}
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.29,
                  letterSpacing: "-0.224px",
                  color: "#1d1d1f",
                  marginBottom: 8,
                }}
              >
                {col.title}
              </h4>
              <ul className="space-y-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      style={{
                        fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif",
                        fontSize: 17,
                        fontWeight: 400,
                        lineHeight: 2.41,
                        letterSpacing: 0,
                        color: "#333333",
                      }}
                      className="hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 pt-6"
          style={{ borderTop: "1px solid #e0e0e0" }}
        >
          <p
            style={{
              fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif",
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.12px",
              color: "#7a7a7a",
            }}
          >
            Copyright &copy; {new Date().getFullYear()} 爱开发. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}