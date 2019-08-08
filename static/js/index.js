/* eslint-disable */
const submitStatus = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });

$('#content').keyup(checker)

$('#content').change(checker)

$('#zkrSubmit').click(function(e) {
    e.preventDefault();
    const content = $('#content').val();
    if (!content || content.length < 50 || content.length > 250) {
        submitStatus.fire({
            type: 'error',
            title: 'يرجى كتابة ذكر لا يزيد عن 250 حرف ولا يقل عن 50 حرف'
        })
    } else {
        $.ajax({
            url: '/api/add',
            data: JSON.stringify({ content: content }),
            type: 'POST',
            contentType: 'application/json',
            success: () =>  submitStatus.fire({ type: 'success', title: 'تم إرسال الذكر لقاعدة البيانات!' }),
            error: () => submitStatus.fire({ type: 'error', title: 'حدث خطاء في إرسال المعلومات' })
        });
    }
})

function checker() {
    const length = $(this).val().length || 0;
    if (length < 50 || length > 250) {
        $('#content').addClass('is-invalid')
    } else {
        $('#content').removeClass('is-invalid').addClass('is-valid')
    }
}

    // $.ajax({
    //     url: '/api/add',
    //     data: content,
    //     method: 'POST',
    //     contentType: 'application/x-www-form-urlencoded',
    //     success: () => alert('تمت إضافة الذكر'), // to lazy to add an alert thing
    //     error: (err) => alert(`'لم تم إضافة الذكر بسبب: ${err}`) // to lazy to add an alert thing
    // })
