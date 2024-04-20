/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as semver from "semver";
import { DBMS_COMPONENTS_QUERY } from "../constants";
export class Neo4jDatabaseInfo {
    constructor(version, edition) {
        this.version = this.toSemVer(version);
        this.rawVersion = version;
        this.edition = edition;
    }
    toSemVer(version) {
        const coerced = semver.coerce(version);
        if (!semver.valid(coerced)) {
            throw new Error(`Could not coerce provided version ${version}`);
        }
        return coerced;
    }
    toString() {
        return this.rawVersion;
    }
    eq(version) {
        return semver.eq(this.version, this.toSemVer(version));
    }
    gt(version) {
        return semver.gt(this.version, this.toSemVer(version));
    }
    gte(version) {
        return semver.gte(this.version, this.toSemVer(version));
    }
    lt(version) {
        return semver.lt(this.version, this.toSemVer(version));
    }
    lte(version) {
        return semver.lt(this.version, this.toSemVer(version));
    }
}
export async function getNeo4jDatabaseInfo(executor) {
    const { records } = await executor.execute(DBMS_COMPONENTS_QUERY, {}, "READ");
    const rawRow = records[0];
    const [rawVersion, edition] = rawRow;
    return new Neo4jDatabaseInfo(rawVersion, edition);
}
