export default function CategoryRadios({ idModifier, onChange, value }) {
  return (
    <fieldset>
      <legend>
        <p>
          <strong>Select Medium</strong>
        </p>
      </legend>
      <div className="radio-btn-container">
        {["Photography", "Illustration"].map(category => (
          <div className="wrapper" key={`${category}-${idModifier}`}>
            <input
              id={`${category}-${idModifier}`}
              type="radio"
              name="category"
              value={category}
              className="radio"
              required
              {...(typeof value === "string" ? { checked: value === category } : {})}
              {...(typeof onChange === "function" ? { onChange } : {})}
            />
            <label htmlFor={`${category}-${idModifier}`} className="update radio btn">
              {category}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}
