import { Link, useParams, type MetaFunction } from "react-router"
import { ArrowLeft } from "lucide-react"
import { getOrderById } from "~/components/page-kits/devlopments/data"
import { OrderHero } from "~/components/page-kits/devlopments/order-detail/order-hero"
import { OrderTimeline } from "~/components/page-kits/devlopments/order-detail/order-timeline"
import { OrderPhases } from "~/components/page-kits/devlopments/order-detail/order-phases"
import { OrderSpec } from "~/components/page-kits/devlopments/order-detail/order-spec"

export const meta: MetaFunction = ({ params }) => {
  const data = getOrderById(params.id)
  const title = data ? `爱开发 - ${data.order.title}` : "爱开发 - 单子详情"
  return [{ title }]
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const data = getOrderById(id)

  if (!data) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="rounded-2xl border border-border/60 bg-card/80 p-10 text-center">
          <h1 className="text-lg font-semibold tracking-tight">未找到该单子</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            可能已被抢走或已下架。回到接单大厅看看其他需求。
          </p>
        </div>
      </div>
    )
  }

  const { order, detail } = data

  return (
    <div className="space-y-6">
      <BackLink />

      <OrderHero order={order} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <OrderSpec requirementsMd={detail.requirementsMd} />
          <OrderPhases
            title="开发阶段"
            description="按阶段交付，每日上传进度，平台可见。"
            phases={detail.phasesPrimary}
            variant="primary"
          />
        </div>
        <div className="space-y-6">
          <OrderTimeline milestones={detail.milestones} />
          <OrderPhases
            title="里程碑款"
            description="资金平台托管，按阶段验收释放。"
            phases={detail.phasesSecondary}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/devlopments"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      返回接单大厅
    </Link>
  )
}