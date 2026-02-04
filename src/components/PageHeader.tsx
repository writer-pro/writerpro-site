import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="section-panel p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">{title}</h1>
          <p className="mt-2 text-sm text-text1">{subtitle}</p>
        </div>
        {actions}
      </div>
    </div>
  )
}
