import { useNavigate, useSearchParams } from 'react-router-dom'
import { DemoSelectorStrip } from '@/components/DemoSelectorStrip'
import { AnchorReferenceBar } from '@/components/AnchorReferenceBar'
import { AuditLoadingState } from '@/components/AuditLoadingState'

export default function AuditNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const scenario = searchParams.get('scenario') ?? '1'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
      <DemoSelectorStrip />
      <div className="w-full max-w-2xl space-y-4">
        <AnchorReferenceBar anchorLabel="Madewell Perfect Vintage Straight, Size 27" />
        <AuditLoadingState onComplete={() => navigate(`/verdict/${scenario}`)} />
      </div>
    </div>
  )
}
