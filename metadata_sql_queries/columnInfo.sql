/***********************************************************************************************************************
NAME:             DatabaseSchemaTableColumnDetails.sql
DESCRIPTION:      In where clause you can filter table names if you just want the metadata for a subset of the tables
                  Need to be DBO of database because script creates some functions to extract metadata
PARAMETERS:       None
RETURN VALUE:     Metadata for database elements
                 
AUTHOR: Drew Holowaty  
                
***********************************************************************************************************************/
If exists ( select 1 from sysobjects where name='ufGetIndexes' )
  Drop function ufGetIndexes;
Go
Create FUNCTION [dbo].[ufGetIndexes] 
(
@pi_iColumnID int,
@pi_iTableID int
)
RETURNS varchar(max) 
AS
BEGIN
  -- Declare the return variable here;
  Declare @vcConcatenatedResult                     as varchar(max);
  Declare @vcResult                                 as varchar(max);
  
  Set @vcConcatenatedResult                         = '';
  SELECT @vcConcatenatedResult                      = COALESCE(@vcConcatenatedResult + ', ','') + i.name 
    From sys.indexes i 
      inner join sys.index_columns ic on ic.object_id   = i.object_id 
                                      and i.object_id   = @pi_iTableID 
                                      and ic.index_id   = i.index_id 
                                      and ic.column_id  = @pi_iColumnID;
  If @vcConcatenatedResult                          <> ''
  Begin
    Set @vcResult                                   = substring(@vcConcatenatedResult,3,len(@vcConcatenatedResult)-2)
  End
  else
    Set @vcResult                                   = 'None'
  Return @vcResult;
END
go
If exists ( select 1 from sysobjects where name='ufGetContraints' )
  Drop function ufGetContraints;
Go
Create FUNCTION [dbo].[ufGetContraints] 
(
  @pi_vcDatabaseName                              varchar(255),
  @pi_vcSchemaName                                varchar(255),
  @pi_vcTableName                                 varchar(255),
  @pi_vcColumnName                                varchar(255)
)
RETURNS varchar(max) 
AS
BEGIN
  -- Declare the return variable here;
  Declare @vcConcatenatedResult                     as varchar(max);
  Declare @vcResult                                 as varchar(max);
  
  Set @vcConcatenatedResult                         = '';
  If @pi_vcColumnName                               Is Not Null
  Begin
    SELECT @vcConcatenatedResult                      = COALESCE(@vcConcatenatedResult + ', ','') + tc.Constraint_Type 
      From INFORMATION_SCHEMA.KEY_COLUMN_USAGE cu  
      Left Join INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON tc.CONSTRAINT_NAME = cu.CONSTRAINT_NAME
      Where cu.Column_name                   = @pi_vcColumnName 
      and cu.TABLE_CATALOG                  =  @pi_vcDatabaseName
      and cu.TABLE_SCHEMA                   =  @pi_vcSchemaName
      and cu.TABLE_NAME                     = @pi_vcTableName 
      --Select * from INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      --Select * from INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  End
  Else
  Begin
    SELECT @vcConcatenatedResult                      = COALESCE(@vcConcatenatedResult + ', ','') + tc.Constraint_Name 
      From INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc 
      Where tc.TABLE_CATALOG                  =  @pi_vcDatabaseName
        and tc.TABLE_SCHEMA                   =  @pi_vcSchemaName
        and tc.TABLE_NAME                     = @pi_vcTableName 
        And tc.Constraint_Type                = 'CHECK'
  End
  If @vcConcatenatedResult                          <> ''
  Begin
    Set @vcResult                                   = substring(@vcConcatenatedResult,3,len(@vcConcatenatedResult)-2)
  End
  else
    Set @vcResult                                   = 'None'
  Return @vcResult;
END
go
Begin Try Drop Table #ColumnAnalysis End Try Begin Catch End Catch
Select --o.object_id,
       db_name()                                             [Database Name],
       c2.Table_Schema                                       [Schema Name],
       o.name                                                [Table Name],
       c.name                                                [Column Name],
       c2.ORDINAL_POSITION                                   [Order in Table],
       c2.DATA_TYPE                                          [SQL Data Type],
       t.name                                                [User Type], 
       c.max_length                                          [Byte Size], 
       c.precision                                           [Precision], 
       case when c.scale is null then '' Else c.scale end    [Scale], 
       case when is_computed = 1 then 'YES' Else 'NO' end    [Is Computed], 
       c2.IS_NULLABLE                                        [Is Nullable], 
       case when C.is_identity = 1 then 'YES' Else 'NO' end    [Is Identity],
       dbo.ufGetContraints( db_name(),
                            c2.Table_Schema,
                            o.name,
                            c.name )                         [Constraint(s)],
       isnull(d.definition,'No Default')                               [Default],
       Case when ( Select top 1 ep.value
           from sys.extended_properties ep 
           where ep.major_id = OBJECT_ID(c2.TABLE_SCHEMA+'.'+c2.TABLE_NAME) 
             AND ep.minor_Id = c2.ORDINAL_POSITION ) is null then 'No Comment' 
          Else ( Select top 1 Replace(Replace(cast(ep.value as varchar(500)),char(10),' '),char(13),' ')
           from sys.extended_properties ep 
           where ep.major_id = OBJECT_ID(c2.TABLE_SCHEMA+'.'+c2.TABLE_NAME) 
             AND ep.minor_Id = c2.ORDINAL_POSITION ) end         [Comments],
       --case when ep.value is null then '' else value end     [Comments]--,
       dbo.ufGetIndexes(c.column_id,o.object_id)             [Indexes for Column]
--Into #ColumnAnalysis
from sys.objects o
  inner join sys.columns c on c.object_id=o.object_id
  left join sys.default_constraints d on o.object_id=d.parent_object_id and d.parent_column_id = c.column_id
  inner join sys.types t on t.user_type_id=c.user_type_id
  inner Join INFORMATION_SCHEMA.COLUMNS c2 on o.name=c2.TABLE_NAME and c.name=c2.COLUMN_NAME
  --left Join sys.extended_properties ep on ep.major_id = OBJECT_ID(c2.TABLE_SCHEMA+'.'+c2.TABLE_NAME) AND ep.minor_Id = c2.ORDINAL_POSITION
  --Left Join INFORMATION_SCHEMA.KEY_COLUMN_USAGE cu on cu.Column_name=c.name and cu.TABLE_CATALOG=db_name() and cu.TABLE_SCHEMA=c2.Table_Schema and cu.TABLE_NAME=o.name
  --Left Join INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc ON tc.CONSTRAINT_NAME = cu.CONSTRAINT_NAME 
where o.type='u' and o.name not in ('sysdiagrams','__RefactorLog')-- and o.name='SystemLog'
--and o.name in ('dimCode','dimIndustryClassificationNAICS','dimCustomer','dimdate','dimOperatingEntity','dimRange','factCustomerBUFirmographics','factCustomerFirmographics','StgDimensionCustomers','dimStatus','dimType','dimEMRProduct')
--and o.name = 'Dimdate'
--order by c2.Table_Schema,o.name, c.column_id
union
SELECT  
       db_name()                                             [Database Name],
       s.name                                                [Schema Name], 
       t.name                                                [Table Name],
       '---',
       0,
       '---',
       '---',
       0,
       0,
       0,
       '---',
       '---',
       '---',
       dbo.ufGetContraints( db_name(),
                            s.name,
                            t.name,
                            NULL )                         [Constraint(s)],
       '---',
       IsNull( Replace(Replace(cast(td.value as varchar(500)),char(10),' '),char(13),' '),'No Comment') AS [table_desc],
       '---'     
      --      ,
    --c.name AS [column],
    --cd.value AS [column_desc]
FROM    sys.objects t
INNER JOIN  sys.schemas s
    ON s.schema_id = t.schema_id
LEFT OUTER JOIN sys.extended_properties td
    ON td.major_id = t.object_id
    AND td.minor_id = 0
    AND td.name = 'MS_Description'
where t.type='u' and t.name not in ( 'sysdiagrams','__RefactorLog') --s.name in ('StageDW','dbo','ETL') and 
Order By [Database Name], [Schema Name], [Table Name], [Order In Table]
