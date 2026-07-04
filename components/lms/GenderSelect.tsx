"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { GENDER_LABELS } from "@/lib/constants";

export function GenderSelect<T extends FieldValues>({ control, name }: { control: Control<T>; name: Path<T> }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="請選擇性別" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GENDER_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
