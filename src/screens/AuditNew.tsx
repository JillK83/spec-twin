import { DemoSelectorStrip } from '@/components/DemoSelectorStrip'
import { AuditNewItemForm } from '@/components/AuditNewItemForm'

export default function AuditNew() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16">
      <DemoSelectorStrip />
      <AuditNewItemForm />
    </div>
  )
}
