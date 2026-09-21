/**
 * 文档 slug 格式校验：小写字母/数字/连字符，长度 1-64。
 * 同时覆盖聚合作用域 "all"（混合练习）与 "wrong"（错题重练）。
 */
export function isValidDocSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]{1,64}$/.test(value);
}
