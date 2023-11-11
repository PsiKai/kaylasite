import React from "react"

export default function SubCategoryRadios({ subCategories, idModifier, onChange, value }) {
  return subCategories.map(subCat => (
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
  ))
}
