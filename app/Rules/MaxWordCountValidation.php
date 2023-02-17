<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MaxWordCountValidation implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(private int $MaxWordCount, string $value)
    {
        //
        $trim = str_replace(array("\r\n", "\r", "\n"), '', $value);
        $length = strlen($trim);
        $this->length = $length;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        return $this->MaxWordCount >= $this->length;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return "The :attribute must not be greater than {$this->MaxWordCount} bytes.\nYour input is {$this->length} byte(s)";
    }
}
