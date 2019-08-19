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

$('.action').click(function(e) {
    const postData = () => {
        $.ajax({
        url: `/api/update`,
        data: JSON.stringify({ action: e.target.id, id: e.target.value }),
        type: 'PUT',
        contentType: 'application/json',
        success: () => {
            if (e.target.id === 'delete') {
                $(`#${e.target.value}`).remove();
            } else if (e.target.id === 'approve') {
                $(e.target).attr('id', 'unapprove').removeClass('btn-primary').addClass('btn-secondary').html('عدم الإعتماد <i class="fa fa-times" aria-hidden="true"></i>')
            } else if (e.target.id === 'unapprove') {
                $(e.target).attr('id', 'approve').removeClass('btn-secondary').addClass('btn-primary').html('إعتماد <i class="fa fa-check" aria-hidden="true"></i>')
            }
            submitStatus.fire({ type: 'success', title: 'تم القيام بالعملية.' })
        },
        error: () => {
            submitStatus.fire({ type: 'error', title: 'حدث خطاء' })
        }
    })
}

    if (e.target.id === 'delete') {
        Swal.fire({
            title: 'هل أنت متاكد؟',
            text: "لا تراجع في هذا القرار",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            showLoaderOnConfirm: true,
            confirmButtonText: 'نعم, قم بالحذف',
            cancelButtonText: 'لا, لا تقم بالحذف'
          }).then((result) => {
            if (result.value) {
                postData();
            }
          })
    } else {
        postData();
    }
});

function checker() {
    const length = $(this).val().length || 0;
    if (length < 50 || length > 250) {
        $('#content').addClass('is-invalid')
    } else {
        $('#content').removeClass('is-invalid').addClass('is-valid')
    }
}