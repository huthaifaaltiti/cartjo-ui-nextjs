import React from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import { useTranslations } from "next-intl";
import { X, Tag as TagIcon } from "lucide-react";

import {
  getTagsInputClassNames,
  tagStyledClassName,
} from "@/constants/tagsInputStyles";

interface TagsInputProps {
  tags: Tag[];
  suggestions?: Tag[];
  placeholder?: string;
  maxTags?: number;
  editable?: boolean;
  allowAdditionFromPaste?: boolean;
  clearAllText?: string;
  className?: string;
  disabled?: boolean;
  onTagsChange: (tags: string[]) => void;
  onTagClick?: (index: number) => void;
  onTagDrag?: (tag: Tag, currPos: number, newPos: number) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  suggestions = [],
  placeholder,
  maxTags = 10,
  editable = true,
  allowAdditionFromPaste = true,
  clearAllText,
  className = "",
  disabled = false,
  onTagsChange,
  onTagClick,
  onTagDrag,
}) => {
  const t = useTranslations();

  const handleDelete = (i: number) => {
    const updated = tags.filter((_, idx) => idx !== i);
    onTagsChange(updated.map((t) => t.text));
  };

  const handleAddition = (tag: Tag) => {
    const styledTag = {
      ...tag,
      className: tagStyledClassName,
    };
    const updated = [...tags, styledTag];
    onTagsChange(updated.map((t: Tag) => t.text));
  };

  const handleTagUpdate = (i: number, tag: Tag) => {
    const updatedTags = [...tags];
    updatedTags[i] = tag;
    onTagsChange(updatedTags.map((t) => t.text));
  };

  const handleClearAll = () => {
    onTagsChange([]);
  };

  const handleTagClick = (index: number) => {
    if (onTagClick) {
      onTagClick(index);
    }
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    if (onTagDrag) {
      onTagDrag(tag, currPos, newPos);
    }
  };

  const renderClearAll = () => (
    <button
      type="button"
      onClick={handleClearAll}
      className="inline-flex items-center gap-1.5 text-xs text-gray-500 mt-3 cursor-pointer hover:text-red-500 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || tags.length === 0}
    >
      <X size={12} />
      {clearAllText || t("components.TagsInput.labels.clearAllTags")}
    </button>
  );

  return (
    <div className={`w-full ${className}`}>
      <ReactTags
        classNames={getTagsInputClassNames(disabled)}
        tags={tags}
        inputFieldPosition="top"
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        onTagUpdate={handleTagUpdate}
        clearAll={tags.length > 0}
        onClearAll={handleClearAll}
        editable={editable}
        maxTags={maxTags}
        allowAdditionFromPaste={allowAdditionFromPaste}
        placeholder={placeholder || t("components.TagsInput.labels.addTags")}
        readOnly={disabled}
      />

      {/* Custom Clear All Button */}
      {tags.length > 0 && renderClearAll()}

      {/* Tag Counter */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          ({tags.length} / {maxTags}) {t("components.TagsInput.labels.tags")}
        </span>
        {tags.length >= maxTags && (
          <span className="text-xs text-amber-600 flex items-center gap-1">
            <TagIcon size={12} />
            {t("components.TagsInput.labels.maxTagsReached")}
          </span>
        )}
      </div>
    </div>
  );
};

export default TagsInput;
