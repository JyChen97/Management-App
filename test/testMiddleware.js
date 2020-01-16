//File name: testMiddleware.js
//Contains unit testing for my middleware function
const Auth = require('../Middleware/Auth');
const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const sinon = require('../node_modules/sinon');

describe('Testing middleware', function(){

    it('should be a function', function(){                      //Test if the middleware is a function
        expect(Auth).to.be.a('function');
    });

    it('function accepts 3 param', function(){                  //Test to see if the function accept 3 parameter
        expect(Auth.length).to.equal(3);
    });

    it('should faill without an ID token ', function(){         //Test if the middleware allows the user to pass if they don't have the correct creditials
        var nextSpy = sinon.spy();
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();

        Auth(req,res,nextSpy);
        Auth(req,res, ()=>{
            expect(nextSpy.calledOnce).to.be.true;
        })
    });

});