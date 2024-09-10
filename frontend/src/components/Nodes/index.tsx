import { useRef, useEffect, useCallback } from "react";
import { useStoreApi } from "@xyflow/react";
import * as SubframeCore from "@subframe/core";
import { Button } from "@/subframe/components/Button";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { Table } from "@/subframe/components/Table";
import {
  nodeTypes,
  NodeTypeNames,
  NodeIcons,
  type NodeResults,
} from "@/types/index";

interface NodeLayoutProps {
  nodeClassName?: string;
  resultsClassName?: string;
  nodeId: string;
  children?: React.ReactNode;
  nodeName: string;
  nodeType: string;
  isSelected: boolean;
  results?: NodeResults;
}

export function NodeLayout({
  nodeClassName,
  resultsClassName,
  nodeId,
  children,
  nodeName,
  nodeType,
  isSelected,
  results,
}: NodeLayoutProps) {
  const resultTableRef = useRef<HTMLTableElement>(null);
  const store = useStoreApi();

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const resultTable = resultTableRef.current;
    if (!resultTable) {
      return;
    }
    resultTable.addEventListener("wheel", (event) => {
      event.stopPropagation();
    });
  });

  const onOpenButtonClick = useCallback(() => {
    const { addSelectedNodes } = store.getState();
    addSelectedNodes([nodeId]);
  }, [store]);

  const formatCell = (cell: any) => {
    const text = cell?.toString() ?? "null";
    // Limit to 50 characters
    const maxLength = 50;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${nodeClassName}`}
    >
      <div
        className={`flex w-112 flex-col items-start gap-6 rounded bg-default-background pt-6 pr-6 pb-6 pl-6 border border-solid border-neutral-border shadow-overlay ${
          isSelected && "shadow-selected-glow"
        } ${nodeClassName}`}
      >
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <IconWithBackground
                variant="brand"
                size="medium"
                icon={NodeIcons[nodeType as keyof SubframeCore.IconName]}
                square={false}
              />
              <span className="text-body-bold font-body-bold text-default-font">
                {NodeTypeNames[nodeType as keyof typeof NodeTypeNames]}
              </span>
            </div>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Button
                  disabled={false}
                  variant="neutral-secondary"
                  size="medium"
                  icon="FeatherMoreVertical"
                  iconRight={null}
                  loading={false}
                  onClick={stopPropagation}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem
                      icon="FeatherCopy"
                      onClick={stopPropagation}
                    >
                      Duplicate
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem
                      icon="FeatherTrash"
                      onClick={stopPropagation}
                    >
                      Delete
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </div>
          <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
            {nodeName}
          </span>
        </div>
        <div
          className="nodrag cursor-default flex w-full flex-col items-start gap-2 rounded border border-solid border-neutral-border bg-default-background pt-6 pr-6 pb-6 pl-6"
          onClick={stopPropagation}
        >
          {children ? children : null}
        </div>
        <div className="flex w-full items-center justify-end">
          <div
            className="nodrag flex w-auto gap-2 pt-2 pr-2 pb-2 pl-2"
            onClick={stopPropagation}
          >
            <Button
              variant="brand-secondary"
              icon="FeatherArrowUpRight"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                onOpenButtonClick();
              }}
            >
              Open
            </Button>
            <Button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Run Node
            </Button>
          </div>
        </div>
      </div>
      {results && (
        <div
          className={`flex w-112 flex-col items-start gap-6 rounded border border-solid border-neutral-border bg-neutral-100 pt-6 pr-6 pb-6 pl-6 shadow-overlay ${resultsClassName}`}
        >
          <div className="flex w-full items-center justify-center gap-6">
            <span className="grow shrink-0 basis-0 text-heading-2 font-heading-2 text-default-font">
              Results
            </span>
          </div>
          {/* <div className="flex items-start gap-1">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Last Run:
            </span>
            <span className="text-body font-body text-default-font">
              6 Hours 41 Minutes Ago
            </span>
          </div> */}
          <div
            className="nodrag cursor-default select-text w-full overflow-auto max-h-80"
            onClick={stopPropagation}
          >
            <table
              className="gap-4 w-full table-auto text-left"
              ref={resultTableRef}
            >
              <thead>
                <tr>
                  {results.columns.map((column, index) => (
                    <th
                      key={index}
                      className="text-heading-3 font-heading-3 text-default-font pr-4"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.data.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, index) => (
                      <td
                        key={index}
                        className="text-body font-body text-default-font"
                      >
                        {formatCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export { default as TransformationNode } from "@/components/Nodes/TransformationNode";
export { default as SourceNode } from "@/components/Nodes/SourceNode";
export { default as DestinationNode } from "@/components/Nodes/DestinationNode";