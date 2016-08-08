var assert = require('assert');
var path = require('path');
var SailsApp = require('sails').Sails;
var Waterline = require('../');
var fsx = require('fs-extra');
var _ = require('lodash');
var lifecycle = require('./helpers/lifecycle');

describe('machinepack-waterline: sum', function() {

  var Sails = new SailsApp();
  var app;
  before(function(done) {
    lifecycle.liftSails(function(err, _sails) {
      if (err) {return done(err);}
      app = _sails;
      return done();
    });
  });

  after(function(done) {
    lifecycle.lowerSails(app, done);
  });

  describe('when called with valid inputs', function() {

    it('should sum all the records when no criteria are used', function(done) {

      // Get the total age of the users
      Waterline.sum({
        model: 'user',
        attribute: 'age'
      })
      .setEnvironment({sails: app})
      .exec({
        error: done,
        success: function(age) {
          assert.equal(age, 113);
          return done();
        }
      });

    });

    it('should sum only the requested records when criteria are used', function(done) {

      // Get the total age of "joe" and "anne"
      Waterline.sum({
        model: 'user',
        attribute: 'age',
        where: {
          id: {'>': 2}
        }
      })
      .setEnvironment({sails: app})
      .exec({
        error: done,
        success: function(age) {
          assert.equal(age, 44);
          return done();
        }
      });

    });

  });

  describe('when called with an an invalid attribute', function() {

    it('should call the `invalidAttribute` exit', function(done) {

      // Get the average age of the users
      Waterline.sum({
        model: 'user',
        attribute: 'xxx'
      })
      .setEnvironment({sails: app})
      .exec({
        error: done,
        success: function() {
          return done(new Error('Should not have called the `success` exit!'));
        },
        invalidAttribute: done
      });

    });


  });
});

