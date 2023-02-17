<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use App\Rules\MaxWordCountValidation;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        // バリデーションルール
        return [
            'user_id' => 'required',
            // タイトル。最大値は40バイト
            'title' => ['required', 'string', new MaxWordCountValidation(40, $this->title)],
            // 詳細。空を許し、最大値は300バイト
            'detail' => ['string', new MaxWordCountValidation(300, $this->detail)],
            // 期日
            'start_date' => 'nullable|date',
            // // ↓不要
            // 'end_date' => 'nullable|date'
        ];
    }

    /**
     * バリーデーションのためにデータを準備
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $user_id =  Auth::id();
        $this->merge(['user_id' => $user_id]);

        $title = (is_null($this->title)) ? '' : $this->title;
        $this->merge(['title' => $title]);

        $detail = (is_null($this->detail)) ? '' : $this->detail;
        $this->merge(['detail' => $detail]);

        $end_date = (isset($this->start_date)) ? (strtotime('+1 day'.$this->start_date)) : null;
        $this->merge(['end_date' => $end_date]);
    }

    /**
     * バリデーション引っかかった時はエラーメッセージを返す
     *
     *
     */
    protected function failedValidation(Validator $validator)
    {
        $response['statusText']  = 'Validation Error';
        $response['errors']  = $validator->errors()->toArray();

        throw new HttpResponseException(
            response()->json( $response, 422 )
        );
    }
}
