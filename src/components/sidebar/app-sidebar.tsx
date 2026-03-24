'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import useTableStore from '@/store/table';
import { TableIcon } from '@radix-ui/react-icons';
import { Database } from 'lucide-react';
import * as React from 'react';
import AddNewTable from '../modules/add-new-table';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.

  const { listTable } = useTableStore();

  return (
    <>
      {' '}
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader className="border-b border-border/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Dumpy</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden px-3 py-2">
            <SidebarGroupLabel className="px-2 py-2 mb-2">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <TableIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Tables</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4 min-w-[20px] justify-center">
                    {listTable.size}
                  </Badge>
                </div>
                <AddNewTable />
              </div>
            </SidebarGroupLabel>

            <div className="max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {Array.from(listTable.values()).length === 0 ? (
                <div className="text-center py-6 px-2">
                  <TableIcon className="size-6 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">No tables found</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Upload files to create tables</p>
                </div>
              ) : (
                <SidebarMenu className="space-y-0.5">
                  {Array.from(listTable.values()).map((table) => (
                    <SidebarMenuItem key={table.label}>
                      <SidebarMenuButton className="h-8 px-2 py-1.5 text-sm font-normal select-none">
                        <div className="flex items-center gap-2 w-full min-w-0 select-text">
                          <TableIcon className="size-3 text-muted-foreground " />
                          <span className="truncate text-foreground/90 select-text text-[11px]">{table.label}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
