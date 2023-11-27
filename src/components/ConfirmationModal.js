import { forwardRef } from "react"

const ConfirmationModal = forwardRef(function ConfirmationModal(
  { onConfirm, children, confirmAction },
  dialogRef
) {
  const handleConfirm = async () => {
    await handleClose()
    onConfirm()
  }

  const handleClose = () => {
    return new Promise(resolve => {
      const keyframe = new KeyframeEffect(
        dialogRef.current,
        [{ translate: "0 -50%", opacity: "0" }],
        { duration: 200, easing: "ease", direction: "normal" }
      )

      const animation = new Animation(keyframe, document.timeline)
      animation.play()
      animation.onfinish = () => {
        dialogRef.current.close()
        resolve()
      }
    })
  }

  return (
    <dialog ref={dialogRef} className="dialog-modal colored">
      <div className="dialog--wrapper">
        <div className="dialog-content">{children}</div>
        <div className="confirmation-dialog--buttons">
          <button className="btn btn-outline-info btn-lg" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-danger btn-lg" onClick={handleConfirm}>
            {`Confirm ${confirmAction}`}
          </button>
        </div>
      </div>
    </dialog>
  )
})

export default ConfirmationModal
