// a function to remove unnecessary characters from the search query
function remove_extra_characters(query) {
    query = query.trim();
    query = query.replace(/ +(?= )/g,'');
    query = query.replace(/,/g, '');
    query = query.replace(/[^a-zA-Z ]/g, "");
    query = query.replace(/ /gi, "%20");
    return query;
}

module.exports = remove_extra_characters;