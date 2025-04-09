/**
 * Data mapper interface that translates between domain and database models
 */
export interface DataMapper<DomainType, DBType> {
  /**
   * Map from database model to domain model
   */
  toDomain(dbModel: DBType): DomainType;
  
  /**
   * Map from domain model to database model
   */
  toDB(domainModel: Partial<DomainType>): Partial<DBType>;
  
  /**
   * Map from creation DTO to database model
   */
  createDtoToDB?(dto: any): Partial<DBType>;
  
  /**
   * Map from update DTO to database model
   */
  updateDtoToDB?(dto: any): Partial<DBType>;
}
