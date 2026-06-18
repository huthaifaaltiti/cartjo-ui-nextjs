"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Comment } from "@/types/comment.type";
import { DataResponse } from "@/types/service-response.type";
import { authFetcher } from "@/utils/authFetcher";
import { createContext, ReactNode, useContext } from "react";

type ContextProps = {
  addComment: (
    productId: string,
    variantId: string,
    content: string,
    rating?: number,
  ) => Promise<DataResponse<Comment>>;
  updateComment: (
    commentId: string,
    content: string,
    rating?: number,
  ) => Promise<DataResponse<Comment>>;
  deleteComment: (commentId: string) => Promise<DataResponse<Comment>>;
};

const PublicProductContext = createContext<undefined | ContextProps>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const PublicProductContextProvider = ({ children }: ProviderProps) => {
  const { locale } = useAuthContext();

  const addComment = async (
    productId: string,
    variantId: string,
    content: string,
    rating?: number,
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(API_ENDPOINTS.PRODUCT.ADD_COMMENT);

    const body: Record<string, unknown> = {
      lang: locale,
      productId,
      variantId,
      content,
      rating,
    };

    return authFetcher<DataResponse<Comment>>(url.toString(), {
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  const updateComment = async (
    commentId: string,
    content: string,
    rating?: number,
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(`${API_ENDPOINTS.PRODUCT.EDIT_COMMENT}/${commentId}`);

    const body: Record<string, unknown> = {
      lang: locale,
      content,
    };

    if (rating) {
      body.rating = String(rating);
    }

    return authFetcher<DataResponse<Comment>>(
      url.toString(),
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
      // locale
    );
  };

  const deleteComment = async (
    commentId: string,
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(`${API_ENDPOINTS.PRODUCT.DELETE_COMMENT}/${commentId}`);

    const body: Record<string, unknown> = {
      lang: locale,
    };

    return authFetcher<DataResponse<Comment>>(
      url.toString(),
      {
        method: "DELETE",
        body: JSON.stringify(body),
      },
      // locale
    );
  };

  return (
    <PublicProductContext.Provider
      value={{ addComment, updateComment, deleteComment }}
    >
      {children}
    </PublicProductContext.Provider>
  );
};

export const usePublicProductContext = () => {
  const context = useContext(PublicProductContext);

  if (!context)
    throw new Error(
      "PublicProductContext should be used within PublicProductContextProvider",
    );

  return context;
};
