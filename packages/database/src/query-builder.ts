
export type QueryFilter = Record<string, unknown>;
export type QueryOrderBy = Record<string, "asc" | "desc">;

export class QueryBuilder {
  private where: QueryFilter = {};
  private select?: Record<string, boolean>;
  private include?: Record<string, boolean | object>;
  private orderBy?: QueryOrderBy;
  private take?: number;
  private skip?: number;

  static create(): QueryBuilder { return new QueryBuilder(); }

  withWhere(where: QueryFilter): QueryBuilder { this.where = { ...this.where, ...where }; return this; }
  withSelect(select: Record<string, boolean>): QueryBuilder { this.select = { ...(this.select ?? {}), ...select }; return this; }
  withInclude(include: Record<string, boolean | object>): QueryBuilder { this.include = { ...(this.include ?? {}), ...include }; return this; }
  withOrderBy(orderBy: QueryOrderBy): QueryBuilder { this.orderBy = { ...(this.orderBy ?? {}), ...orderBy }; return this; }
  withTake(take: number): QueryBuilder { this.take = take; return this; }
  withSkip(skip: number): QueryBuilder { this.skip = skip; return this; }

  build(): { where: QueryFilter; select?: Record<string, boolean> | undefined; include?: Record<string, boolean | object> | undefined; orderBy?: QueryOrderBy; take?: number; skip?: number } {
    return { where: this.where, select: this.select, include: this.include, orderBy: this.orderBy, take: this.take, skip: this.skip };
  }
}
