import { Dialog } from '@base-ui/react/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isDestructive = false }: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[100] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 outline-none">
          <Card className="w-full shadow-lg border-border">
            <CardContent className="p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold text-foreground">{title}</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">{message}</Dialog.Description>
              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close render={<Button variant="outline" onClick={onCancel} />}>
                  Cancel
                </Dialog.Close>
                <Button variant={isDestructive ? "destructive" : "default"} onClick={onConfirm}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
