export default function Note({ note }) {
  return (
    <div className="note">
      <h4 className="mt-0">Note</h4>
      <div className="note-text" dangerouslySetInnerHTML={{ __html: note }} />
    </div>
  )
}
