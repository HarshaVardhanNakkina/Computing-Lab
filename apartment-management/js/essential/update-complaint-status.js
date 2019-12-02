$('[id=update-complaint-status-form]').each(function() {
    console.log($(this))
    $(this).submit(event => {
        event.preventDefault();
        const formData = $(this).serializeArray().reduce((acc, cur) => {
            return {...acc, [cur.name]: cur.value}
        },{});
        const url = $(this).attr('action')
        $.post(url, formData, function(){}).done((response) => {
            
        }).fail((err) => {

        })
    })
})