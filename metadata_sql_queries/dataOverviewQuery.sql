--Select * from sys.objects where type ='u'
--Select top 100 * from CUSTOMER_RELATIONS.DBO.SOFTLANDING_ESCALATIONS_TBL_D
--Use CUSTOMER_RELATIONS
--go
set nocount on
Begin Try Drop table #tmp end try begin catch end catch
Begin Try Drop table ##Results end try begin catch end catch
Begin Try Drop table ##Results2 end try begin catch end catch
Select --o.object_id,
distinct
       o.object_id,
       db_name()                                             [Database Name],
       c2.Table_Schema                                       [Schema Name],
       o.name                                                [Table Name],
       (Select count(1) 
                  from sys.partitions 
                  where object_id = o.object_id
                    and index_id  = 0)                       [Partition Amount],
       c.name                                                [Column Name],
       c2.ORDINAL_POSITION                                   [Order in Table],
       c2.DATA_TYPE                                          [SQL Data Type],
       t.name                                                [User Type], 
       c.max_length                                          [Byte Size], 
       c.precision                                           [Precision], 
       case when c.scale is null then '' Else c.scale end    [Scale], 
       case when is_computed = 1 then 'YES' Else 'NO' end    [Is Computed], 
       c2.IS_NULLABLE                                        [Is Nullable], 
       case when is_identity = 1 then 'YES' Else 'NO' end    [Is Identity],
       --dbo.ufGetContraints( db_name(),
       --                     c2.Table_Schema,
       --                     o.name,
       --                     c.name )                         [Constraint(s)],
       isnull(d.definition,'')                               [Default]--,
       --dbo.ufGetIndexes(c.column_id,o.object_id)             [Indexes for Column]
into #tmp
from sys.objects o--Select * from sys.objects
  inner join sys.schemas s on o.schema_id = s.schema_id
  inner join sys.columns c on c.object_id=o.object_id--Select * from sys.columns
  left join sys.default_constraints d on o.object_id=d.parent_object_id and d.parent_column_id = c.column_id
  inner join sys.types t on t.user_type_id=c.user_type_id
  inner Join INFORMATION_SCHEMA.COLUMNS c2 on o.name=c2.TABLE_NAME and c.name=c2.COLUMN_NAME and c2.TABLE_SCHEMA=s.name--Select * from INFORMATION_SCHEMA.COLUMNS
/*from sys.objects o
  inner join sys.columns c on c.object_id=o.object_id
  inner Join sys.schemas s on o.schema_id = s.schema_id
  inner Join INFORMATION_SCHEMA.COLUMNS c2 on o.name=c2.TABLE_NAME and c.name=c2.COLUMN_NAME*/
  left Join sys.extended_properties ep on ep.major_id = OBJECT_ID(c2.TABLE_SCHEMA+'.'+c2.TABLE_NAME) AND ep.minor_Id = c2.ORDINAL_POSITION
where o.type='u' and o.name not like 'sys%' --and o.name in ('TB_FC_APPEAL_LOANS','TB_DOOR_25_SUMMARY','TB_LAST_CONTACT_QRPC','TB_PROP_PRES_ORDER_EXCLUSION','TB_PROP_PRES_STATIC_VENDOR_POP','TB_PROP_PRES_ORDERS_WITHID','SOFTLANDING_ESCALATIONS_TBL_D','TB_BPO_AUTOMATION_TYPE_LU','','','','','') 
  --and o.name in (select distinct TableName collate SQL_Latin1_General_CP1_CI_AS
  --                from [_SQLServerAdmin].dbo.TablesToBeReplicated)
--and o.name not in ('sysdiagrams','factAssetClassification','dimSynonym','dimRelatedWord','temp')
--and o.name in ('controlAuditLog','controlBatch','controlSystemLog')
--and o.name = 'MemberContract'xxxxxxxxx
order by [Schema Name],[Table Name],[Order in Table]	
Print '1'
CREATE TABLE ##Results  ([Schema Name]       varchar(255),
                        [Table Name]  varchar(255),
                        [Column Amount]     int,
                        [Row Amount]        bigint,
                        [Partition Amount]  smallint,
                        [Highest Compression Type] varchar(5),
                        ReservedSpaceInKB    varchar(50),
                        DataSpaceInKB        varchar(50),
                        IndexSizeInKB       varchar(50),
                        UnusedSpaceInKB      varchar(50))
CREATE TABLE ##Results2  (SchemaName       varchar(255),
                        [name]  varchar(255),
                        --ColumnAmount     int,
                        [rows]        bigint,
                        [reserved]    varchar(50),
                        [data]       varchar(50),
                        [index_size]       varchar(50),
                        [unused]      varchar(50))
--Select  * from #tmp where [Schema Name]='Rawstage'

--Select * from sys.sysindexes
--Select * from sys.objects
--sp_spaceused 'sms.in_codes'

Insert Into ##Results ( [Schema Name], [Table Name], [Partition Amount], [Column Amount])
Select [Schema Name]                                                  [Schema Name],
       [Table Name]                                                   [Table Name],
       Case When [Partition Amount]  = 0 Then 1 Else [Partition Amount] end                     --If the partition amount is zero is
                                                                                                --the clustered index lives on the same partition
                                                                                                --as the data
                                                                      [Partition Amount],
       COUNT(1)                                                       [Column Amount]
from #tmp t
group by [Schema Name],[Table Name],[Partition Amount]
Order by [Schema Name],[Table Name],[Partition Amount]
Update ##Results
  Set [Highest Compression Type] = Case When Exists (Select 1 from sys.partitions where object_id=T.object_id and data_compression_desc='Page') Then
                                      'Page'
                                    When Exists (Select 1 from sys.partitions where object_id=T.object_id and data_compression_desc='Row') Then
                                      'Row'
                                    Else
                                      'None'
                                    End
  From ##Results R
    Inner Join #tmp T On T.[Schema Name] = R.[Schema Name] collate Latin1_General_CI_AS_WS
	and T.[Table Name] = R.[Table Name] collate Latin1_General_CI_AS_WS
Declare @vcSchemaName varchar(255) 
Declare @vcSourceTableName varchar(255) 
Declare @vcTable varchar(255) 
--select * from #tmp
While Exists ( Select 1 from #tmp )
Begin
  Select top 1 @vcSchemaName = [Schema Name], @vcSourceTableName=[Table Name] from #tmp
  print '@vcSchemaName = ' + @vcSchemaName + '|@vcSourceTableName = ' + @vcSourceTableName
  Set @vcTable = @vcSchemaName + '.' + @vcSourceTableName
  Insert Into ##Results2([name], [rows],[reserved],[data],[index_size],[unused])
	Exec sp_SpaceUsed @vcTable;
    --Exec sp_SpaceUsed 'tblXModulesAdminGroups'--\
	
    Update ##Results2  
      Set SchemaName = @vcSchemaName ,
          name = REPLACE(name,@vcSchemaName+'.','')
      where SchemaName is Null
                        
  Delete #tmp Where [Schema Name]=@vcSchemaName 
	and [Table Name]=@vcSourceTableName
End 
Update ##Results
  Set [Row Amount] = R2.[rows],
      ReservedSpaceInKB = Replace(R2.[reserved],' KB',''),
      DataSpaceInKB=Replace(r2.[data],' KB',''),
      IndexSizeInKB=Replace(R2.[index_size],' KB',''),
      UnusedSpaceInKB=Replace(r2.[unused],' KB','')
  From ##Results R
    Inner Join ##Results2 R2 On R2.[name] = r.[Table Name] And R.[Schema Name] = R2.SchemaName
--Drop table #tmp
/*
--For Table Extract Metrics of SCCM
select db_name() as [Database Name],* from #Results
  Where [Table Name] like '_Tables%'
  Order by [Database Name],[Schema Name],[Table Name]
*/
select @@Servername,db_name() as [Database Name],R.* from ##Results R
  Where [Schema Name] not in ('Stage')
  Order by [Schema Name] desc,[Row Amount] desc,[Database Name],[Table Name]
--Select * from ##Results2 --order by SourceTableName
--Select * from ##Results
/*
Select sum([column amount]) from ##results where [row amount] > 1000
Select [Schema Name], count(1) from ##results where [row amount] > 1000 group by [Schema Name]
Select * from  ##results where [row amount] > 1000
Drop table #Results
Drop table #Results2

Update Stage.ArcherOrgStructure
Set [EffectiveDate] = cast([EffectiveDate] as datetime),
[ExpirationDate]= Cast(ExpirationDate as datetime)
Truncate table sales.OrderLinesHash
Truncate table sales.OrdersHash
*/