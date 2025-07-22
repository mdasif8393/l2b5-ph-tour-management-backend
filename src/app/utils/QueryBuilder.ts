/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../constant";

export class QueryBuilder<T> {
  // const allTours = new QueryBuilder(Tour.find(), query)
  public modelQuery: Query<T[], T>; // modelQuery = Tour.find()
  public readonly query: Record<string, string>; // query = query

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter); //Tour.find().find(filter)

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm || "";

    const searchQuery = {
      $or: searchableField.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return {
      page,
      limit,
      total: totalDocuments,
      totalPage,
    };
  }
}
