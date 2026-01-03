"use client";

import { useAuthContext } from "@/hooks/useAuthContext";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Comment } from "@/types/comment.type";
import { DataResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { createContext, ReactNode, useContext } from "react";

type ContextProps = {
  addComment: (
    productId: string,
    content: string,
    rating?: number
  ) => Promise<DataResponse<Comment>>;
  updateComment: (
    commentId: string,
    content: string,
    rating?: number
  ) => Promise<DataResponse<Comment>>;
  deleteComment: (commentId: string) => Promise<DataResponse<Comment>>;
};

const PublicProductContext = createContext<undefined | ContextProps>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const PublicProductContextProvider = ({ children }: ProviderProps) => {
  const { locale, accessToken } = useAuthContext();

  const addComment = async (
    productId: string,
    content: string,
    rating?: number
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(API_ENDPOINTS.PRODUCT.ADD_COMMENT);

    const body: Record<string, unknown> = {
      lang: locale,
      productId,
      content,
    };

    if (rating) {
      body.rating = String(rating);
    }

    return fetcher<DataResponse<Comment>>(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      // locale
    );
  };

  const updateComment = async (
    commentId: string,
    content: string,
    rating?: number
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(`${API_ENDPOINTS.PRODUCT.EDIT_COMMENT}/${commentId}`);

    const body: Record<string, unknown> = {
      lang: locale,
      content,
    };

    if (rating) {
      body.rating = String(rating);
    }

    return fetcher<DataResponse<Comment>>(
      url,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      // locale
    );
  };

  const deleteComment = async (
    commentId: string
  ): Promise<DataResponse<Comment>> => {
    const url = new URL(`${API_ENDPOINTS.PRODUCT.DELETE_COMMENT}/${commentId}`);

    const body: Record<string, unknown> = {
      lang: locale,
    };

    return fetcher<DataResponse<Comment>>(
      url,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
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
      "PublicProductContext should be used within PublicProductContextProvider"
    );

  return context;
};
