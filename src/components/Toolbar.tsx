import { Box, Typography, Switch, PaletteMode, Skeleton, Button } from '@mui/material'
import { ExportIcon } from './ExportIcon'
import { FC } from 'react'
import {
  GridCsvGetRowsToExportParams,
  gridExpandedSortedRowIdsSelector,
  GridFilterModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiContext
} from '@mui/x-data-grid-pro'
import { useLoadingContext } from '../hooks/useLoadingContext'
import { useQuickFilterTracking } from '../hooks/useQuickFilterTracking'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

interface ToolbarProps {
  paletteMode: PaletteMode
  setPaletteMode: (paletteMode: PaletteMode) => void
}

const generateExportFilename = (filterModel: GridFilterModel) => {
  let filename = 'hawaii-attorney-database'

  const quickFilterValues = filterModel.quickFilterValues || []

  if (quickFilterValues.length > 0) {
    filename += `--${quickFilterValues.join('-')}`
  }

  const columnFilters = filterModel.items || []

  const formattedColumnFilters = columnFilters.map(filter =>
    filter.value instanceof Date ? { ...filter, value: filter.value.toISOString().slice(0, 10) } : filter
  )

  formattedColumnFilters.forEach(filter => {
    if (filter.value !== undefined && filter.value !== '') {
      filename += `--${filter.field}-${filter.value}`
    }
  })

  return filename.toLowerCase().replace(/\s+/g, '-')
}

export const Toolbar: FC<ToolbarProps> = ({ paletteMode, setPaletteMode }) => {
  const { isLoading } = useLoadingContext()
  const apiRef = useGridApiContext()
  const quickFilterRef = useQuickFilterTracking()

  const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) => gridExpandedSortedRowIdsSelector(apiRef)

  const handleExport = () => {
    const filterModel = apiRef.current.state.filter.filterModel

    apiRef.current.exportDataAsCsv({ fileName: generateExportFilename(filterModel), getRowsToExport: getFilteredRows })
  }

  const handleModeToggle = () => setPaletteMode(paletteMode === 'light' ? 'dark' : 'light')

  return (
    <GridToolbarContainer sx={{ pb: 0.5 }}>
      <Box
        sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}
      >
        <Typography sx={{ fontSize: { xs: 18, sm: 20 }, pl: 0.75 }} variant="h6">
          Hawaii Attorney Database
        </Typography>

        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5, pr: 0.25 }}>
          <DarkModeIcon sx={{ fontSize: { xs: 16, sm: 20 }, opacity: paletteMode === 'dark' ? 1 : 0.25 }} />

          <Switch checked={paletteMode === 'light'} onChange={handleModeToggle} size="small" />

          <LightModeIcon sx={{ fontSize: { xs: 16, sm: 20 }, opacity: paletteMode === 'light' ? 1 : 0.25 }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between', pl: 0.25, width: '100%' }}>
        {isLoading ? (
          <Skeleton sx={{ height: { xs: 28, sm: 30 }, m: 0.25, width: 300 }} />
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <GridToolbarColumnsButton />

            <GridToolbarFilterButton />

            <Button color="primary" size="small" startIcon={<ExportIcon />} onClick={handleExport}>
              Export
            </Button>
          </Box>
        )}

        <Box ref={quickFilterRef}>
          <GridToolbarQuickFilter
            disabled={isLoading}
            sx={{ width: { xs: 300, md: 350, lg: 400 }, '& .MuiInputBase-root': { fontSize: { xs: 14, md: 16 } } }}
          />
        </Box>
      </Box>
    </GridToolbarContainer>
  )
}
