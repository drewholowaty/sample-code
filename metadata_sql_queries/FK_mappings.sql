Select  FK2.name                                  As [Foreign Key Name]
      , s.name                                    As [Table Schema]
      , O.name                                    As [Table]
      , C.Name                                    As [Column Name]
      , S2.Name                                   As [Referened Table Schema]
      , O2.Name                                   As [Referened Table]
      , C2.Name                                   As [Referened Column]
  from sys.objects                                O
    Inner Join sys.schemas                        S   On O.schema_id                = S.schema_id
    Inner Join sys.foreign_keys                   FK2 On FK2.parent_object_id       = O.object_id
    Inner Join sys.foreign_key_columns            FKC On FKC.constraint_object_id   = FK2.object_id
    Inner Join sys.columns                        C   On O.object_id                = C.object_id
                                                  And    FKC.parent_column_id       = C.column_id
    Inner Join sys.foreign_keys                   FK  on FK.object_id               = FK2.object_id
    Inner Join sys.objects                        O2  on O2.object_id               = FK.referenced_object_id
    Inner Join sys.schemas                        S2  On O2.schema_id               = S2.schema_id
    Inner Join sys.foreign_key_columns            FKC2 On FKC2.constraint_object_id = FK2.object_id
    Inner Join sys.columns                        C2   On O2.object_id              = C2.object_id
                                                  And    FKC2.constraint_column_id  = C2.column_id
  Where o.type = 'U'
  Order by o.name