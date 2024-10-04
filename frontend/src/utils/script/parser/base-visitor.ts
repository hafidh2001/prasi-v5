import type * as oxc from "./oxc-types";
import type {
  BindingProperty,
  ComputedMemberExpression,
  ExportNamedDeclaration,
  FunctionBody,
  JSXIdentifier,
  ObjectProperty,
  ParenthesizedExpression,
} from "@oxc-parser/wasm";

import type { Node, Callback, RecursiveVisitors } from "./acorn-types";

const ignore = <S>(_n: Node, _st: S, _cb: Callback<S>) => {};

export class BaseVisitor implements Required<RecursiveVisitors<unknown>> {
  ArrayExpression<S>(n: oxc.ArrayExpression, st: S, cb: Callback<S>) {
    for (const el of n.elements) {
      if (el) {
        cb(el.expression, st);
      }
    }
  }
  ArrayPattern<S>(n: oxc.ArrayPattern, st: S, cb: Callback<S>) {
    for (const el of n.elements) {
      if (el) {
        cb(el, st);
      }
    }
  }
  ArrowFunctionExpression<S>(
    n: oxc.ArrowFunctionExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.body, st);

    if (n.typeParameters) {
      cb(n.typeParameters, st);
    }
  }
  AssignmentExpression<S>(n: oxc.AssignmentExpression, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);
  }
  AssignmentPattern<S>(n: oxc.AssignmentPattern, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);

    // could be wrongly inherited from swc.PatternBase (could not find a way to trigger this)
    // if (n.typeAnnotation) { cb(n.typeAnnotation, st) }
  }
  AssignmentPatternProperty<S>(
    n: oxc.AssignmentPatternProperty,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.key, st);

    if (n.value) {
      cb(n.value, st);
    }
  }
  AssignmentProperty<S>(n: oxc.AssignmentProperty, st: S, cb: Callback<S>) {
    cb(n.value, st);
  }
  AwaitExpression<S>(n: oxc.AwaitExpression, st: S, cb: Callback<S>) {
    cb(n.argument, st);
  }
  BigIntLiteral = ignore;
  BinaryExpression<S>(n: oxc.BinaryExpression, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);
  }
  BlockStatement<S>(n: oxc.BlockStatement, st: S, cb: Callback<S>) {
    for (const stmt of n.stmts) {
      cb(stmt, st);
    }
  }
  BooleanLiteral = ignore;
  BreakStatement<S>(n: oxc.BreakStatement, st: S, cb: Callback<S>) {
    if (n.label) {
      cb(n.label, st);
    }
  }
  CallExpression<S>(n: oxc.CallExpression, st: S, cb: Callback<S>) {
    cb(n.callee, st);

    for (const arg of n.arguments) {
      if (typeof arg.expression !== "object") {
        cb(arg as any, st);
      } else {
        cb(arg.expression, st);
      }
    }

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  CatchClause<S>(n: oxc.CatchClause, st: S, cb: Callback<S>) {
    if (n.param) {
      cb(n.param, st);
    }

    cb(n.body, st);
  }
  ClassDeclaration<S>(n: oxc.ClassDeclaration, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.identifier, st);

    for (const implement of n.implements) {
      cb(implement, st);
    }

    if (n.superClass) {
      cb(n.superClass, st);
    }

    if (n.superTypeParams) {
      cb(n.superTypeParams, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }

    for (const member of n.body) {
      cb(member, st);
    }
  }
  ClassExpression<S>(n: oxc.ClassExpression, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    if (n.identifier) {
      cb(n.identifier, st);
    }

    for (const implement of n.implements) {
      cb(implement, st);
    }

    if (n.superClass) {
      cb(n.superClass, st);
    }

    if (n.superTypeParams) {
      cb(n.superTypeParams, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }

    for (const member of n.body) {
      cb(member, st);
    }
  }
  ClassMethod<S>(n: oxc.ClassMethod, st: S, cb: Callback<S>) {
    cb(n.key, st);

    for (const decorator of n.function.decorators ?? []) {
      cb(decorator, st);
    }

    for (const param of n.function.params) {
      cb(param, st);
    }

    if (n.function.returnType) {
      cb(n.function.returnType, st);
    }

    if (n.function.typeParameters) {
      cb(n.function.typeParameters, st);
    }

    if (n.function.body) {
      cb(n.function.body, st);
    }
  }
  ClassProperty<S>(n: oxc.ClassProperty, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.key, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }

    if (n.value) {
      cb(n.value, st);
    }
  }
  Computed<S>(n: oxc.ComputedPropName, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  ConditionalExpression<S>(
    n: oxc.ConditionalExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.test, st);
    cb(n.consequent, st);
    cb(n.alternate, st);
  }
  Constructor<S>(n: oxc.Constructor, st: S, cb: Callback<S>) {
    cb(n.key, st);

    for (const param of n.params) {
      cb(param, st);
    }

    if (n.body) {
      cb(n.body, st);
    }
  }
  ContinueStatement<S>(n: oxc.ContinueStatement, st: S, cb: Callback<S>) {
    if (n.label) {
      cb(n.label, st);
    }
  }
  DebuggerStatement = ignore;
  Decorator<S>(n: oxc.Decorator, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  DoWhileStatement<S>(n: oxc.DoWhileStatement, st: S, cb: Callback<S>) {
    cb(n.body, st);
    cb(n.test, st);
  }
  EmptyStatement = ignore;
  ExportAllDeclaration<S>(n: oxc.ExportAllDeclaration, st: S, cb: Callback<S>) {
    cb(n.source, st);

    // @ts-expect-error -- asserts is not typed in ExportAllDeclaration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    n.asserts = n.asserts ?? n.with;

    if (n.asserts) {
      cb(n.asserts, st);
    }
  }
  ExportDeclaration<S>(n: oxc.ExportDeclaration, st: S, cb: Callback<S>) {
    cb(n.declaration, st);
  }
  ExportDefaultDeclaration<S>(
    n: oxc.ExportDefaultDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.declaration, st);
  }
  ExportDefaultExpression<S>(
    n: oxc.ExportDefaultExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  ExportDefaultSpecifier<S>(
    n: oxc.ExportDefaultSpecifier,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.exported, st);
  }
  ObjectProperty = ignore;
  ExportNamedDeclaration<S>(n: ExportNamedDeclaration, st: S, cb: Callback<S>) {
    for (const specifier of n.specifiers) {
      cb(specifier, st);
    }

    if (n.declaration) cb(n.declaration, st);

    if (n.source) {
      cb(n.source, st);
    }
  }
  ExportNamespaceSpecifier<S>(
    n: oxc.ExportNamespaceSpecifier,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.name, st);
  }
  ExportSpecifier<S>(n: oxc.NamedExportSpecifier, st: S, cb: Callback<S>) {
    if (n.exported) {
      cb(n.exported, st);
    }

    cb(n.orig, st);
  }
  ExpressionStatement<S>(n: oxc.ExpressionStatement, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  ForInStatement<S>(n: oxc.ForInStatement, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);
    cb(n.body, st);
  }
  ForOfStatement<S>(n: oxc.ForOfStatement, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);
    cb(n.body, st);
  }
  ForStatement<S>(n: oxc.ForStatement, st: S, cb: Callback<S>) {
    if (n.init) {
      cb(n.init, st);
    }

    if (n.test) {
      cb(n.test, st);
    }

    if (n.update) {
      cb(n.update, st);
    }

    cb(n.body, st);
  }
  FunctionDeclaration<S>(n: oxc.FunctionDeclaration, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.identifier, st);

    for (const param of n.params) {
      cb(param, st);
    }

    if (n.returnType) {
      cb(n.returnType, st);
    }

    if (n.typeParameters) {
      cb(n.typeParameters, st);
    }

    if (n.body) {
      cb(n.body, st);
    }
  }
  BindingProperty<S>(n: BindingProperty, st: S, cb: Callback<S>) {
    cb(n.value, st);
  }
  FunctionBody<S>(n: FunctionBody, st: S, cb: Callback<S>) {
    for (const statement of n.statements ?? []) {
      cb(statement, st);
    }
  }
  ParenthesizedExpression<S>(
    n: ParenthesizedExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  ComputedMemberExpression<S>(
    n: ComputedMemberExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.object, st);
    cb(n.expression, st);
  }
  StaticMemberExpression<S>(
    n: ParenthesizedExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  FunctionExpression<S>(n: oxc.FunctionExpression, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    if (n.identifier) {
      cb(n.identifier, st);
    }

    for (const param of n.params) {
      cb(param, st);
    }

    if (n.returnType) {
      cb(n.returnType, st);
    }

    if (n.typeParameters) {
      cb(n.typeParameters, st);
    }

    if (n.body) {
      cb(n.body, st);
    }
  }
  GetterProperty<S>(n: oxc.GetterProperty, st: S, cb: Callback<S>) {
    cb(n.key, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }

    if (n.body) {
      cb(n.body, st);
    }
  }
  Identifier<S>(
    n: oxc.Identifier | oxc.BindingIdentifier,
    st: S,
    cb: Callback<S>
  ) {
    if ("typeAnnotation" in n && n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  IfStatement<S>(n: oxc.IfStatement, st: S, cb: Callback<S>) {
    cb(n.test, st);
    cb(n.consequent, st);

    if (n.alternate) {
      cb(n.alternate, st);
    }
  }
  Import = ignore;
  ImportDeclaration<S>(n: oxc.ImportDeclaration, st: S, cb: Callback<S>) {
    for (const specifier of n.specifiers) {
      cb(specifier, st);
    }

    cb(n.source, st);

    // @ts-expect-error -- asserts is not typed in ExportAllDeclaration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    n.asserts = n.asserts ?? n.with;

    if (n.asserts) {
      cb(n.asserts, st);
    }
  }
  ImportDefaultSpecifier<S>(
    n: oxc.ImportDefaultSpecifier,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.local, st);
  }
  ImportNamespaceSpecifier<S>(
    n: oxc.ImportNamespaceSpecifier,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.local, st);
  }
  ImportSpecifier<S>(n: oxc.NamedImportSpecifier, st: S, cb: Callback<S>) {
    if (n.imported) {
      cb(n.imported, st);
    }

    cb(n.local, st);
  }
  Invalid = ignore;
  JSXAttribute<S>(n: oxc.JSXAttribute, st: S, cb: Callback<S>) {
    cb(n.name, st);

    if (n.value) {
      cb(n.value, st);
    }
  }
  JSXIdentifier = ignore;
  JSXSpreadAttribute = ignore;
  JSXClosingElement<S>(n: oxc.JSXClosingElement, st: S, cb: Callback<S>) {
    cb(n.name, st);
  }
  JSXClosingFragment = ignore;
  JSXElement<S>(n: oxc.JSXElement, st: S, cb: Callback<S>) {
    cb(n.openingElement, st);

    for (const child of n.children) {
      cb(child, st);
    }

    if (n.closingElement) {
      cb(n.closingElement, st);
    }
  }
  JSXEmptyExpression = ignore;
  JSXExpressionContainer<S>(
    n: oxc.JSXExpressionContainer,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  JSXFragment<S>(n: oxc.JSXFragment, st: S, cb: Callback<S>) {
    cb(n.opening, st);

    for (const child of n.children) {
      cb(child, st);
    }

    cb(n.closing, st);
  }
  JSXMemberExpression<S>(n: oxc.JSXMemberExpression, st: S, cb: Callback<S>) {
    cb(n.property, st);
    cb(n.object, st);
  }
  JSXNamespacedName<S>(n: oxc.JSXNamespacedName, st: S, cb: Callback<S>) {
    cb(n.namespace, st);
    cb(n.name, st);
  }
  Program<S>(n: oxc.Program, st: S, cb: Callback<S>) {
    for (const stmt of n.body) {
      cb(stmt, st);
    }
  }
  JSXOpeningElement<S>(n: oxc.JSXOpeningElement, st: S, cb: Callback<S>) {
    cb(n.name, st);

    for (const attr of n.attributes) {
      cb(attr, st);
    }

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  JSXOpeningFragment = ignore;
  JSXSpreadChild<S>(n: oxc.JSXSpreadChild, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  JSXText = ignore;
  KeyValuePatternProperty<S>(
    n: oxc.KeyValuePatternProperty,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.key, st);
    cb(n.value, st);
  }
  KeyValueProperty<S>(n: oxc.KeyValueProperty, st: S, cb: Callback<S>) {
    cb(n.key, st);
    cb(n.value, st);
  }
  LabeledStatement<S>(n: oxc.LabeledStatement, st: S, cb: Callback<S>) {
    cb(n.label, st);
    cb(n.body, st);
  }
  MemberExpression<S>(n: oxc.MemberExpression, st: S, cb: Callback<S>) {
    cb(n.object, st);
    cb(n.property, st);
  }
  MetaProperty = ignore;
  MethodProperty<S>(n: oxc.MethodProperty, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.key, st);

    for (const param of n.params) {
      cb(param, st);
    }

    if (n.returnType) {
      cb(n.returnType, st);
    }

    if (n.typeParameters) {
      cb(n.typeParameters, st);
    }

    if (n.body) {
      cb(n.body, st);
    }
  }
  Module<S>(n: oxc.Module, st: S, cb: Callback<S>) {
    for (const stmt of n.body) {
      cb(stmt, st);
    }
  }
  NewExpression<S>(n: oxc.NewExpression, st: S, cb: Callback<S>) {
    cb(n.callee, st);

    if (n.arguments) {
      for (const arg of n.arguments) {
        cb(arg.expression, st);
      }
    }

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  NullLiteral = ignore;
  NumericLiteral = ignore;
  ObjectExpression<S>(n: oxc.ObjectExpression, st: S, cb: Callback<S>) {
    for (const property of n.properties) {
      cb(property, st);
    }
  }
  ObjectPattern<S>(n: oxc.ObjectPattern, st: S, cb: Callback<S>) {
    for (const property of n.properties) {
      cb(property, st);
    }

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  OptionalChainingExpression<S>(
    n: oxc.OptionalChainingExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.base, st);
  }
  Parameter<S>(n: oxc.Param, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.pat, st);
  }
  ParenthesisExpression<S>(
    n: oxc.ParenthesisExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  PrivateMethod<S>(n: oxc.PrivateMethod, st: S, cb: Callback<S>) {
    cb(n.key, st);

    for (const decorator of n.function.decorators ?? []) {
      cb(decorator, st);
    }

    for (const param of n.function.params) {
      cb(param, st);
    }

    if (n.function.returnType) {
      cb(n.function.returnType, st);
    }

    if (n.function.typeParameters) {
      cb(n.function.typeParameters, st);
    }

    if (n.function.body) {
      cb(n.function.body, st);
    }
  }
  PrivateName<S>(n: oxc.PrivateName, st: S, cb: Callback<S>) {
    cb(n.id, st);
  }
  PrivateProperty<S>(n: oxc.PrivateProperty, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.key, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }

    if (n.value) {
      cb(n.value, st);
    }
  }
  RegExpLiteral = ignore;
  RestElement<S>(n: oxc.RestElement, st: S, cb: Callback<S>) {
    cb(n.argument, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  ReturnStatement<S>(n: oxc.ReturnStatement, st: S, cb: Callback<S>) {
    if (n.argument) {
      cb(n.argument, st);
    }
  }
  Script<S>(n: oxc.Script, st: S, cb: Callback<S>) {
    for (const stmt of n.body) {
      cb(stmt, st);
    }
  }
  SequenceExpression<S>(n: oxc.SequenceExpression, st: S, cb: Callback<S>) {
    for (const expression of n.expressions) {
      cb(expression, st);
    }
  }
  SetterProperty<S>(n: oxc.SetterProperty, st: S, cb: Callback<S>) {
    cb(n.key, st);
    cb(n.param, st);

    if (n.body) {
      cb(n.body, st);
    }
  }
  SpreadElement<S>(n: oxc.SpreadElement, st: S, cb: Callback<S>) {
    cb(n.arguments, st);
  }
  StaticBlock<S>(n: oxc.StaticBlock, st: S, cb: Callback<S>) {
    cb(n.body, st);
  }
  StringLiteral = ignore;
  Super = ignore;
  SuperPropExpression<S>(n: oxc.SuperPropExpression, st: S, cb: Callback<S>) {
    cb(n.obj, st);
    cb(n.property, st);
  }
  SwitchCase<S>(n: oxc.SwitchCase, st: S, cb: Callback<S>) {
    if (n.test) {
      cb(n.test, st);
    }

    for (const consequent of n.consequent) {
      cb(consequent, st);
    }
  }
  SwitchStatement<S>(n: oxc.SwitchStatement, st: S, cb: Callback<S>) {
    cb(n.discriminant, st);

    for (const cases of n.cases) {
      cb(cases, st);
    }
  }
  TaggedTemplateExpression<S>(
    n: oxc.TaggedTemplateExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.tag, st);
    cb(n.template, st);

    if (n.typeParameters) {
      cb(n.typeParameters, st);
    }
  }
  TemplateElement = ignore;
  TemplateLiteral<S>(
    n: oxc.TemplateLiteral | oxc.TsTemplateLiteralType,
    st: S,
    cb: Callback<S>
  ) {
    for (const quasis of n.quasis) {
      cb(quasis, st);
    }

    if ("expressions" in n) {
      for (const expressions of n.expressions) {
        cb(expressions, st);
      }
    }

    if ("types" in n) {
      for (const types of n.types) {
        cb(types, st);
      }
    }
  }
  ThisExpression = ignore;
  ThrowStatement<S>(n: oxc.ThrowStatement, st: S, cb: Callback<S>) {
    cb(n.argument, st);
  }
  TryStatement<S>(n: oxc.TryStatement, st: S, cb: Callback<S>) {
    cb(n.block, st);

    if (n.handler) {
      cb(n.handler, st);
    }

    if (n.finalizer) {
      cb(n.finalizer, st);
    }
  }
  TsArrayType<S>(n: oxc.TsArrayType, st: S, cb: Callback<S>) {
    cb(n.elemType, st);
  }
  TsExpressionWithTypeArguments<S>(
    n: oxc.TsExpressionWithTypeArguments,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  TsInterfaceDeclaration<S>(
    n: oxc.TsInterfaceDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.id, st);
    cb(n.body, st);

    for (const ext of n.extends) {
      cb(ext, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsInterfaceBody<S>(n: oxc.TsInterfaceBody, st: S, cb: Callback<S>) {
    for (const ele of n.body) {
      cb(ele, st);
    }
  }
  TsKeywordType = ignore;
  TsPropertySignature<S>(n: oxc.TsPropertySignature, st: S, cb: Callback<S>) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- params can be undefined
    for (const param of n.params ?? []) {
      cb(param, st);
    }

    cb(n.key, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsAsExpression<S>(n: oxc.TsAsExpression, st: S, cb: Callback<S>) {
    cb(n.expression, st);
    cb(n.typeAnnotation, st);
  }
  TsCallSignatureDeclaration<S>(
    n: oxc.TsCallSignatureDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    for (const param of n.params) {
      cb(param, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  TsConditionalType<S>(n: oxc.TsConditionalType, st: S, cb: Callback<S>) {
    cb(n.checkType, st);
    cb(n.extendsType, st);
    cb(n.trueType, st);
    cb(n.falseType, st);
  }
  TsConstAssertion<S>(n: oxc.TsConstAssertion, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  TsConstructorType<S>(n: oxc.TsConstructorType, st: S, cb: Callback<S>) {
    for (const param of n.params) {
      cb(param, st);
    }

    cb(n.typeAnnotation, st);

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsConstructSignatureDeclaration<S>(
    n: oxc.TsConstructSignatureDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    for (const param of n.params) {
      cb(param, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  TsEnumDeclaration<S>(n: oxc.TsEnumDeclaration, st: S, cb: Callback<S>) {
    cb(n.id, st);

    for (const member of n.members) {
      cb(member, st);
    }
  }
  TsEnumMember<S>(n: oxc.TsEnumMember, st: S, cb: Callback<S>) {
    cb(n.id, st);

    if (n.init) {
      cb(n.init, st);
    }
  }
  TsExportAssignment<S>(n: oxc.TsExportAssignment, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  TsExternalModuleReference<S>(
    n: oxc.TsExternalModuleReference,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
  }
  TsFunctionType<S>(n: oxc.TsFunctionType, st: S, cb: Callback<S>) {
    for (const param of n.params) {
      cb(param, st);
    }

    cb(n.typeAnnotation, st);

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsGetterSignature<S>(n: oxc.TsGetterSignature, st: S, cb: Callback<S>) {
    cb(n.key, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  TsImportEqualsDeclaration<S>(
    n: oxc.TsImportEqualsDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.id, st);
    cb(n.moduleRef, st);
  }
  TsImportType<S>(n: oxc.TsImportType, st: S, cb: Callback<S>) {
    cb(n.argument, st);

    if (n.qualifier) {
      cb(n.qualifier, st);
    }

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  TsIndexedAccessType<S>(n: oxc.TsIndexedAccessType, st: S, cb: Callback<S>) {
    cb(n.indexType, st);
    cb(n.objectType, st);
  }
  TsIndexSignature<S>(n: oxc.TsIndexSignature, st: S, cb: Callback<S>) {
    for (const param of n.params) {
      cb(param, st);
    }

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  TsInferType<S>(n: oxc.TsInferType, st: S, cb: Callback<S>) {
    cb(n.typeParam, st);
  }
  TsInstantiation<S>(n: oxc.TsInstantiation, st: S, cb: Callback<S>) {
    cb(n.expression, st);
    cb(n.typeArguments, st);
  }
  TsIntersectionType<S>(n: oxc.TsIntersectionType, st: S, cb: Callback<S>) {
    for (const type of n.types) {
      cb(type, st);
    }
  }
  TsLiteralType<S>(n: oxc.TsLiteralType, st: S, cb: Callback<S>) {
    cb(n.literal, st);
  }
  TsMappedType<S>(n: oxc.TsMappedType, st: S, cb: Callback<S>) {
    if (n.nameType) {
      cb(n.nameType, st);
    }

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }

    cb(n.typeParam, st);
  }
  TsMethodSignature<S>(n: oxc.TsMethodSignature, st: S, cb: Callback<S>) {
    for (const param of n.params) {
      cb(param, st);
    }

    cb(n.key, st);

    if (n.typeAnn) {
      cb(n.typeAnn, st);
    }

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsModuleBlock<S>(n: oxc.TsModuleBlock, st: S, cb: Callback<S>) {
    for (const stmt of n.body) {
      cb(stmt, st);
    }
  }
  TsModuleDeclaration<S>(n: oxc.TsModuleDeclaration, st: S, cb: Callback<S>) {
    cb(n.id, st);

    if (n.body) {
      cb(n.body, st);
    }
  }
  TsNamespaceDeclaration<S>(
    n: oxc.TsNamespaceDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.id, st);
    cb(n.body, st);
  }
  TsNamespaceExportDeclaration<S>(
    n: oxc.TsNamespaceExportDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.id, st);
  }
  TsNonNullExpression<S>(n: oxc.TsNonNullExpression, st: S, cb: Callback<S>) {
    cb(n.expression, st);
  }
  TsOptionalType<S>(n: oxc.TsOptionalType, st: S, cb: Callback<S>) {
    cb(n.typeAnnotation, st);
  }
  TsParameterProperty<S>(n: oxc.TsParameterProperty, st: S, cb: Callback<S>) {
    for (const decorator of n.decorators ?? []) {
      cb(decorator, st);
    }

    cb(n.param, st);
  }
  TsParenthesizedType<S>(n: oxc.TsParenthesizedType, st: S, cb: Callback<S>) {
    cb(n.typeAnnotation, st);
  }
  TsQualifiedName<S>(n: oxc.TsQualifiedName, st: S, cb: Callback<S>) {
    cb(n.left, st);
    cb(n.right, st);
  }
  TsRestType<S>(n: oxc.TsRestType, st: S, cb: Callback<S>) {
    cb(n.typeAnnotation, st);
  }
  TsSatisfiesExpression<S>(
    n: oxc.TsSatisfiesExpression,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.expression, st);
    cb(n.typeAnnotation, st);
  }
  TsSetterSignature<S>(n: oxc.TsSetterSignature, st: S, cb: Callback<S>) {
    cb(n.key, st);
    cb(n.param, st);
  }
  TsThisType = ignore;
  TsTupleElement<S>(n: oxc.TsTupleElement, st: S, cb: Callback<S>) {
    if (n.label) {
      cb(n.label, st);
    }

    cb(n.ty, st);
  }
  TsTupleType<S>(n: oxc.TsTupleType, st: S, cb: Callback<S>) {
    for (const el of n.elemTypes) {
      cb(el, st);
    }
  }
  TsTypeAliasDeclaration<S>(
    n: oxc.TsTypeAliasDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    cb(n.id, st);
    cb(n.typeAnnotation, st);

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsType = ignore;
  TsTypeAnnotation<S>(n: oxc.TsTypeAnnotation, st: S, cb: Callback<S>) {
    cb(n.typeAnnotation, st);
  }
  TsTypeParameter<S>(n: oxc.TsTypeParameter, st: S, cb: Callback<S>) {
    cb(n.name, st);

    if (n.constraint) {
      cb(n.constraint, st);
    }

    if (n.default) {
      cb(n.default, st);
    }
  }
  TsTypeParameterDeclaration<S>(
    n: oxc.TsTypeParameterDeclaration,
    st: S,
    cb: Callback<S>
  ) {
    for (const param of n.parameters) {
      cb(param, st);
    }
  }
  TsTypeAssertion<S>(n: oxc.TsTypeAssertion, st: S, cb: Callback<S>) {
    cb(n.expression, st);
    cb(n.typeAnnotation, st);
  }
  TsTypeElement = ignore;
  TsTypeLiteral<S>(n: oxc.TsTypeLiteral, st: S, cb: Callback<S>) {
    for (const member of n.members) {
      cb(member, st);
    }
  }
  TsTypeOperator<S>(n: oxc.TsTypeOperator, st: S, cb: Callback<S>) {
    cb(n.typeAnnotation, st);
  }
  TsTypeParameterInstantiation<S>(
    n: oxc.TsTypeParameterInstantiation,
    st: S,
    cb: Callback<S>
  ) {
    for (const param of n.params) {
      cb(param, st);
    }
  }
  TsTypeReference<S>(n: oxc.TsTypeReference, st: S, cb: Callback<S>) {
    cb(n.typeName, st);

    if (n.typeParams) {
      cb(n.typeParams, st);
    }
  }
  TsTypePredicate<S>(n: oxc.TsTypePredicate, st: S, cb: Callback<S>) {
    cb(n.paramName, st);

    if (n.typeAnnotation) {
      cb(n.typeAnnotation, st);
    }
  }
  TsTypeQuery<S>(n: oxc.TsTypeQuery, st: S, cb: Callback<S>) {
    cb(n.exprName, st);

    if (n.typeArguments) {
      cb(n.typeArguments, st);
    }
  }
  TsUnionType<S>(n: oxc.TsUnionType, st: S, cb: Callback<S>) {
    for (const type of n.types) {
      cb(type, st);
    }
  }
  UnaryExpression<S>(n: oxc.UnaryExpression, st: S, cb: Callback<S>) {
    cb(n.argument, st);
  }
  UpdateExpression<S>(n: oxc.UpdateExpression, st: S, cb: Callback<S>) {
    cb(n.argument, st);
  }
  VariableDeclaration<S>(n: oxc.VariableDeclaration, st: S, cb: Callback<S>) {
    for (const decl of n.declarations) {
      cb(decl, st);
    }
  }
  VariableDeclarator<S>(n: oxc.VariableDeclarator, st: S, cb: Callback<S>) {
    cb(n.id, st);

    if (n.init) {
      cb(n.init, st);
    }
  }
  WhileStatement<S>(n: oxc.WhileStatement, st: S, cb: Callback<S>) {
    cb(n.test, st);
    cb(n.body, st);
  }
  WithStatement<S>(n: oxc.WithStatement, st: S, cb: Callback<S>) {
    cb(n.object, st);
    cb(n.body, st);
  }
  YieldExpression<S>(n: oxc.YieldExpression, st: S, cb: Callback<S>) {
    if (n.argument) {
      cb(n.argument, st);
    }
  }
}
export default BaseVisitor;
