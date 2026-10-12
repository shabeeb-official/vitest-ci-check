/* eslint-disable @typescript-eslint/no-explicit-any */
import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { ReactNode } from "react";
import { INode, renderNodeList } from "@/utils/render-ui";
import { composeRegistry, domainRegistry, genericRegistry } from "@/registry";

type MyAccordionProps = {
  type: "single" | "multiple";
  collapsible: boolean;
  className?: string;
  children?: ReactNode;
};

export const MyAccordion = (props: MyAccordionProps) => {
  const { type, collapsible, className, children } = props;
  return (
    <RadixAccordion.Root
      type={type}
      collapsible={collapsible}
      className={className}
    >
      {children}
    </RadixAccordion.Root>
  );
};
interface AccordionItemSlots {
  trigger: ReactNode;
  content: ReactNode;
}

interface AccordionContentSlots {
  title: string;
  description: string;
}

interface MyAccordionItemProps {
  value: string;
  className?: string;
  trigger: string;
  children: ReactNode;
}
export const MyAccordionItem = (props: MyAccordionItemProps) => {
  const { value, className, trigger, children } = props;
  interface Props {
    text: string;
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const Paragraph = ({ text }: Props) => {
    const parts = text.split(urlRegex);

    return (
      <p>
        {parts.map((part, index) => {
          const isUrl = urlRegex.test(part);

          if (isUrl) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }

          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  // TODO: This needs to move to either render-ui or optimize here so that
  // the rendering is not done from here
  const renderTrigger = (trigger: string | INode) => {
    if (typeof trigger === "string") {
      return trigger;
    }

    return renderNodeList(trigger, {
      registry: composeRegistry(genericRegistry, domainRegistry),
      runtimeScope: {},
    });
  };

  return (
    <RadixAccordion.Item value={value} className="flex flex-col border-b border-gray-200">
      <RadixAccordion.Header>
        <RadixAccordion.Trigger className={`${className} group`}>
          {renderTrigger(trigger)}
          <ChevronDownIcon className="ml-auto text-gray-400 group-data-[state=open]:rotate-180" />
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>

      <RadixAccordion.Content>{children}</RadixAccordion.Content>
    </RadixAccordion.Item>
  );
};
