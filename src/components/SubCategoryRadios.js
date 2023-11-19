import React from "react"

export default function SubCategoryRadios({
  subCategories,
  idModifier,
  onChange,
  value,
  customSubCat = false,
}) {
  return (
    <fieldset className="form-field--group">
      <legend>
        <p>
          <strong>Subject Matter</strong>
        </p>
      </legend>
      <div className="radio-btn-container">
        {subCategories.map(subCat => (
          <React.Fragment key={`${subCat}-${idModifier}`}>
            <input
              id={`${subCat}-${idModifier}`}
              type="radio"
              className="radio"
              name="subCategory"
              value={subCat}
              {...(typeof value === "string" ? { checked: value === subCat } : {})}
              {...(typeof onChange === "function" ? { onChange } : {})}
            />
            <label className="radio btn btn-sm sub" htmlFor={`${subCat}-${idModifier}`}>
              {subCat}
            </label>
          </React.Fragment>
        ))}
      </div>
      {customSubCat ? (
        <div>
          <input
            id={`subcategory-${idModifier}`}
            type="text"
            name="subCategory"
            className="subcat"
            autoComplete="off"
            placeholder="Enter Subject"
            required
            spellCheck="false"
            value={value || ""}
            onChange={typeof onChange === "function" ? onChange : null}
          />
        </div>
      ) : null}
    </fieldset>
  )
}
