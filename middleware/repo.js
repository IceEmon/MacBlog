/**
 * Created by Emonice on 2017/11/9.
 */
const Q = require('q');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    add,
    addArray,
    update,
    updateMulti,
    updateById,
    query,
    queryById,
    queryOne,
    removeById,
    removeBy,
    getOneDoc,
    getDoc,
    saveDoc,
    applyFilter,
    getCount,
    aggregate,
    aggregateCountByField,
    cursor
};

function cursor(Model, query, projection = null) {
    return Model.find(query, projection).cursor();
}

function add(Model, data) {
    data = _.omit(data, '_id');
    let model = new Model(data);
    return model.save()
        .then(data => data && data.view());
}

function addArray(Model, data) {
    if (!_.isArray(data)) {
        data = [data];
    }
    if (!data || !data.length) {
        return Q([]);
    }
    return Model.insertMany(data)
        .then(results => results && results.map(item => item && item.view()));
}

function update(Model, query, data, upsert) {
    if (upsert === undefined && upsert === null) {
        upsert = false;
    } else {
        upsert = !!upsert;
    }
    return Model.findOneAndUpdate(query, data, {new: true, upsert})
        .then(result => result && result.view());
}

function updateMulti(Model, query, data, multi, upsert) {
    if (multi === undefined) multi = false;
    if (upsert === undefined) upsert = false;
    return Model.update(query, data, {multi, upsert})
        .then(data => data);
}

function updateById(Model, _id, data, upsert) {
    return Model.findByIdAndUpdate(_id, data, {new: true, upsert})
        .then(data => data && data.view());
}

function query(Model, query, projection = null) {
    return Model.find(query, projection)
        .then(data => data && data.map(item => item && item.view()));
}

function queryById(Model, _id, projection = null) {
    return Model.findById(_id, projection)
        .then(data => data && data.view());
}

function queryOne(Model, query, projection = null) {
    return Model.findOne(query, projection)
        .then(data => data && data.view());
}

function removeById(Model, _id) {
    return Model.findByIdAndRemove(_id)
        .then(data => data && data.view());
}

function removeBy(Model, query) {
    return Model.remove(query)
        .then(data => data);
}

function getOneDoc(Model, query) {
    return Model.findOne(query);
}

function getDoc(Model, query) {
    return Model.find(query);
}

function saveDoc(doc) {
    return doc.save()
        .then(() => doc.view());
}

function applyFilter(Model, filter, byCursor = false) {
    filter.where = filter.where || {};
    if (!filter.order && Model.orderKey) {
        filter.order = Model.orderKey();
    }
    let query = Model.find(filter.where);
    if (filter.select) {
        query.select(filter.select);
    }
    if (filter.order) {
        query.sort(filter.order);
    }
    let skip = filter.skip;
    if (skip) {
        query.skip(skip);
    }
    let limit = filter.limit;
    if (limit && limit > 0) {
        query.limit(limit);
    }
    if (!byCursor) {
        return query.exec()
            .then(results => results && results.map(result => result.view()));
    }
    return query.cursor();
}

function getCount(Model, query = {}) {
    return Model.find(query).count();
}

function aggregate(Model, aggregations) {
    return Model.aggregate(aggregations);
}

function aggregateCountByField(Model, projectId, field) {
    let aggregates = [];
    if (projectId) {
        aggregates.push({
            '$match': {projectId: new ObjectId(projectId)}
        });
    }
    let projection = {};
    projection[field] = 1;
    aggregates.push({
        '$project': projection
    });
    aggregates.push({
        '$group': {
            '_id': '$' + field,
            'count': {'$sum': 1}
        }
    });
    return aggregate(Model, aggregates);
}