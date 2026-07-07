"use client";

import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/constants";

function splitPhone(value: string) {
  const match = value.match(/^(\+\d{1,4})\s?(.*)$/);
  if (match && COUNTRY_CODES.some((c) => c.code === match[1])) {
    return { code: match[1], number: match[2] };
  }
  return { code: DEFAULT_COUNTRY_CODE, number: value };
}

/** 電話輸入框：國碼下拉選單 + 號碼輸入，兩者合併成單一字串存入表單的 phone 欄位。 */
export function PhoneInput<T extends FieldValues>({ control, name }: { control: Control<T>; name: Path<T> }) {
  const { field } = useController({ control, name });
  const { code, number } = splitPhone(field.value ?? "");

  function update(nextCode: string, nextNumber: string) {
    field.onChange(nextNumber ? `${nextCode} ${nextNumber}` : "");
  }

  return (
    <div className="flex gap-2">
      <Select value={code} onValueChange={(nextCode) => update(nextCode, number)}>
        <SelectTrigger className="w-[104px] shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.flag} {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        inputMode="tel"
        className="flex-1"
        placeholder="912345678"
        value={number}
        onChange={(e) => update(code, e.target.value)}
        onBlur={field.onBlur}
      />
    </div>
  );
}
