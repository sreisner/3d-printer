$(document).ready(function() {
    retrieveCategories();
    retrievePlastics();
});

function retrieveCategories() {
    $.ajax('/api/category',
    {
        method: 'get',
        success: function(categories) {
            categories.forEach(function(category) {
                $('#categories').append('<option value="' + category._id + '">' + category.name + '</option>')
            });
        }
    });
}

function retrievePlastics() {
    $.ajax('/api/plastic',
    {
        method: 'get',
        success: function(plastics) {
            plastics.forEach(function(plastic) {
                $('#plastics').append('<option value="' + plastic._id + '">' + plastic.name + '</option>')
            });
        }
    });
}
