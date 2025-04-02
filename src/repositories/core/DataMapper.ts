
/**
 * Generic interface for mapping between database models and domain models
 */
export interface DataMapper<DomainModel, DatabaseModel> {
  /**
   * Maps a database model to a domain model
   */
  toDomain(dbModel: DatabaseModel): DomainModel;
  
  /**
   * Maps a domain model to a database model
   */
  toDB(domainModel: Partial<DomainModel>): Partial<DatabaseModel>;
}
