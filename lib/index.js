"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isSetup = (s) => s === "setup";
const hasSubDirectory = (s) => s.includes("/");
const startsWithAt = (s) => s.startsWith("@");
const endsWithExtension = (s) => /\.*$/.test(s);
const isStyleImport = (s) => s.endsWith(".less") || s.endsWith(".css") || s.endsWith(".scss");
exports.default = (s) => [
    // import React from 'react'
    {
        match: s.and(s.isAbsoluteModule, s.hasOnlyDefaultMember, s.not(s.or(s.moduleName(hasSubDirectory), s.moduleName(endsWithExtension), s.moduleName(startsWithAt), s.moduleName(isSetup)))),
        sort: s.member(s.unicode)
    },
    // import React, { Component } from 'react'
    {
        match: s.and(s.isAbsoluteModule, s.hasNamedMembers, s.not(s.or(s.moduleName(hasSubDirectory), s.moduleName(endsWithExtension), s.moduleName(startsWithAt), s.moduleName(isSetup)))),
        sort: s.member(s.unicode),
        sortNamedMembers: s.name(s.unicode)
    },
    {
        separator: true
    },
    // import Foo from 'bar/foo'
    // import { foo, bar } from 'foo/bar'
    {
        match: s.and(s.or(s.moduleName(isSetup), s.moduleName(hasSubDirectory)), s.not(s.or(s.moduleName(endsWithExtension), s.moduleName(startsWithAt)))),
        sort: s.member(s.unicode),
        sortNamedMembers: s.name(s.unicode)
    },
    {
        separator: true
    },
    // import Foo from '@private-repo/foo'
    {
        match: s.and(s.moduleName(startsWithAt), s.not(s.moduleName(endsWithExtension))),
        sort: s.member(s.unicode),
        sortNamedMembers: s.name(s.unicode)
    },
    {
        separator: true
    },
    // import * as foo from 'bar'
    {
        match: s.hasNamespaceMember,
        sort: s.member(s.unicode),
        sortNamedMembers: s.name(s.unicode)
    },
    {
        separator: true
    },
    // import Image from 'foo/image.svg'
    {
        match: s.and(s.moduleName(endsWithExtension), s.not(s.moduleName(isStyleImport))),
        sort: s.member(s.unicode)
    },
    {
        separator: true
    },
    // import 'foo/bar'
    {
        match: s.and(s.hasNoMember, s.not(s.moduleName(isStyleImport))),
        sort: s.moduleName(s.unicode)
    },
    {
        separator: true
    },
    // import './foo.css'
    {
        match: s.and(s.hasNoMember, s.moduleName(isStyleImport)),
        sort: s.moduleName(s.unicode)
    }
];
