import * as chai from "chai";
import Merge from "../src/merge";
import File from "../src/file";
import FileList from "../src/file_list";

let expect = chai.expect;

describe("test 1, one include", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "REPORT zmain.\n\nINCLUDE zinclude."));
    files.push(new File("zinclude.abap", "WRITE / 'Hello World!'."));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 2, 2 includes", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\n\n" +
                                      "include zinc1.\n" +
                                      "include zinc2.\n\n" +
                                      "write / 'Main include'."));
    files.push(new File("zinc1.abap", "write / 'hello @inc1'."));
    files.push(new File("zinc2.abap", "write / 'hello @inc2'."));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 3, subinclude", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\n\n" +
                                      "include zinc1.\n" +
                                      "include zinc2.\n\n" +
                                      "write / 'Main include'."));
    files.push(new File("zinc1.abap", "include zsubinc1.\nwrite / 'hello @inc1'."));
    files.push(new File("zinc2.abap", "write / 'hello @inc2'."));
    files.push(new File("zsubinc1.abap", "write / 'hello @inc2'."));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 4, standard include", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\n\n" +
                                      "include zinc1.  \" A comment here\n" +
                                      "include zinc2.\n\n" +
                                      "write / 'Main include'."));
    files.push(new File("zinc1.abap", "include standard.\nwrite / 'hello @inc1'."));
    files.push(new File("zinc2.abap", "write / 'hello @inc2'."));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 5, file not found", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\ninclude zinc1."));
    expect(Merge.merge.bind(Merge, files, "zmain")).to.throw("file not found: zinc1");
  });
});

describe("test 6, not all files used", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\ninclude zinc1."));
    files.push(new File("zinc1.abap", "write / 'foo'."));
    files.push(new File("zinc2.abap", "write / 'bar'."));
    expect(Merge.merge.bind(Merge, files, "zmain")).to.throw("Not all files used: [zinc2]");
  });
});

describe("test 7, a unused README.md file", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\ninclude zinc1."));
    files.push(new File("zinc1.abap", "write / 'foo'."));
    files.push(new File("README.md", "foobar"));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 8, a unused README.md file", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\ninclude zinc1."));
    files.push(new File("zinc1.abap", "write / 'foo'."));
    files.push(new File("README.md", "foobar"));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 9, @@abapmerge commands", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "report zmain.\n" +
                                      "\n" +
                                      "write / 'Main include'.\n" +
                                      "* @@abapmerge include style.css > write '$$'.\n" +
                                      "  \" @@abapmerge include js/script.js > write '$$'.\n" +
                                      "  \" @@abapmerge wrong pragma, just copy to output\n" +
                                      "  \" @@abapmerge include data.txt > write '$$'.\n" +
                                      "  \" @@abapmerge include data.txt > write '$$$'. \" Unescaped !" ));
    files.push(new File("style.css", "body {\nbackground: red;\n}"));
    files.push(new File("data.txt", "content = 'X';\n"));
    files.push(new File("js/script.js", "alert(\"Hello world!\");\n"));
    let result = Merge.merge(files, "zmain");
    expect(result).to.be.a("string");
    expect(result.split("\n").length).to.equal(26);
  });
});

describe("test 10, one include, namespaced", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "REPORT zmain.\n\nINCLUDE /foo/zinclude."));
    files.push(new File("#foo#zinclude.abap", "WRITE / 'Hello World!'."));
    expect(Merge.merge(files, "zmain")).to.be.a("string");
  });
});

describe("test 11, simple class", () => {
  it("something", () => {
    let files = new FileList();
    files.push(new File("zmain.abap", "REPORT zmain.\n\nINCLUDE zinc1."));
    files.push(new File("zinc1.abap", "write / 'foo'."));
    files.push(
      new File("zcl_class.clas.abap",
               "CLASS zcl_class DEFINITION PUBLIC CREATE PUBLIC.\n" +
               "  PUBLIC SECTION.\n" +
               "    CLASS-METHODS: blah.\n" +
               "ENDCLASS.\n" +
               "CLASS zcl_class IMPLEMENTATION.\n" +
               "  METHOD blah.\n" +
               "  ENDMETHOD.\n" +
               "ENDCLASS."));
    let result = Merge.merge(files, "zmain");
    expect(result).to.be.a("string");
    expect(result.split("\n").length).to.equal(20);
  });
});
