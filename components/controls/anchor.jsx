import React, { useState } from "react";
import Input from "../input";

export default function TypeAnchor({ field }) {
  const { field: anchor } = field;
  const { href, text, "@title": title } = anchor;
  const [value, setValue] = useState({ href, text });

  const setVal = obj => setValue(prev => ({ ...prev, ...obj }));

  return (
    <div className="flex flex-col gap-1">
      <h4 className="capitalize text-sm">{title}</h4>

      <div className="flex gap-1">
        <Input
          label="Title"
          onInput={e => setVal({ text: e.target.value })}
          value={value.text}
        />
        <Input
          label="Href"
          onInput={e => setVal({ href: e.target.value })}
          value={value.href}
        />
      </div>
    </div>
  );
}
