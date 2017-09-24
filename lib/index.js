"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const none = (s, selector) => (...predicates) => s.not(s.or.apply(null, predicates.map(p => selector(p))));
const insensitiveUnicode = (a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
const isReact = (s) => s === "react";
const isSetup = (s) => s === "setup";
const isSubDir = (s) => s.includes("/");
const isStartsWithAt = (s) => s.startsWith("@");
const isWithExtension = (s) => /\.\w+$/.test(s);
const isStyleImport = (s) => s.endsWith(".less") || s.endsWith(".css") || s.endsWith(".scss");
exports.default = (s) => [
    {
        match: s.moduleName(isReact)
    },
    // import React from 'react'
    {
        match: s.and(s.isAbsoluteModule, s.not(s.hasOnlyNamespaceMember), none(s, s.moduleName)(isSubDir, isSetup)),
        sort: s.member(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import Foo from 'bar/foo'
    // import { foo, bar } from 'foo/bar'
    {
        match: s.and(s.or(s.moduleName(isSubDir), s.moduleName(isSetup)), s.not(s.hasOnlyNamespaceMember), none(s, s.moduleName)(isStartsWithAt, isWithExtension)),
        sort: s.member(insensitiveUnicode),
        sortNamedMembers: s.name(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import Foo from '@private-repo/foo'
    {
        match: s.and(s.moduleName(isStartsWithAt), s.not(s.hasOnlyNamespaceMember)),
        sort: s.member(insensitiveUnicode),
        sortNamedMembers: s.name(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import * as foo from 'bar'
    {
        match: s.hasNamespaceMember,
        sort: s.member(insensitiveUnicode),
        sortNamedMembers: s.name(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import Image from 'foo/image.svg'
    {
        match: s.and(s.moduleName(isWithExtension), s.not(s.moduleName(isStyleImport))),
        sort: s.member(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import 'foo/bar'
    {
        match: s.and(s.hasNoMember, s.not(s.moduleName(isStyleImport))),
        sort: s.moduleName(insensitiveUnicode)
    },
    {
        separator: true
    },
    // import './foo.css'
    {
        match: s.and(s.hasNoMember, s.moduleName(isStyleImport)),
        sort: s.moduleName(insensitiveUnicode)
    }
];
