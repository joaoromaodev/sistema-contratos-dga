"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { podeGerenciarUsuarios, podeGerenciarConfiguracoes } from "@/lib/permissoes";
import { logout } from "@/lib/actions/logout";
import type { UsuarioAtual } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contratos", label: "Contratos e Convênios", icon: FileText },
];

export function AppSidebar({ usuario }: { usuario: UsuarioAtual }) {
  const pathname = usePathname();
  const itens = [
    ...NAV_ITEMS,
    ...(podeGerenciarUsuarios(usuario.papel)
      ? [{ href: "/usuarios", label: "Usuários", icon: Users }]
      : []),
    ...(podeGerenciarConfiguracoes(usuario.papel)
      ? [{ href: "/configuracoes", label: "Configurações", icon: Settings }]
      : []),
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-3 py-3">
        <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold">CCON</span>
          <span className="text-xs text-muted-foreground">
            Contratos e Convênios
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itens.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-3 py-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {usuario.nome}
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              {usuario.papel.replace(/_/g, " ")}
            </p>
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              title="Sair da conta"
            >
              <LogOut />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
