package dbutils

import (
	"errors"
	"log"
	"stiller/pkg/templates"

	"github.com/leporo/sqlf"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

var (
    ErrUserNotFound = errors.New("user not found")
    ErrTemplateNotFound = errors.New("template not found")
)

func getGallerySlot(gallery int, template_slot templates.MetatemplateSlot, conn *sqlite.Conn) StillerGallerySlot {
    new_slot := StillerGallerySlot{
        RefId:    template_slot.Ref,
        MetatemplateSlot: template_slot,
    }

    slotinfo_stmt := sqlf.
        Select("*").
            From("galleryslot").
        Where("slotid = ? and gallery = ?", new_slot.Ref, gallery)

    sqlitex.Execute(conn, slotinfo_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_slot.Title = stmt.GetText("title")
            new_slot.Description = stmt.GetText("description")
            new_slot.ResId = int(stmt.GetInt64("res"))
            return nil
        },

        Args: slotinfo_stmt.Args(),
    })


    return new_slot
}

func GetGalleryData(gallery int) (*StillerGalleryData, error) {
    new_dbconn, dbconn_err := NewConn()
    if dbconn_err != nil {
        return nil, dbconn_err
    }

    defer CloseConn(new_dbconn)

    slots_iterator := sqlf.
        Select("template").
        From("gallery").
        Where("id = ?", gallery)

    template_id := int(-1)
    sqlitex.ExecuteTransient(new_dbconn, slots_iterator.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            template_id = int(stmt.GetInt64("template"))
            return nil
        },

        Args: slots_iterator.Args(),
    })

    if template_id == -1 {
        return nil, ErrTemplateNotFound
    }

    template_data, template_data_err := templates.GetTemplateData(template_id)
    if template_data_err != nil {
        return nil, template_data_err
    }

    template_index := make(map[string]*templates.MetatemplateSlot)
    for index := range template_data.Slots {
        slot := template_data.Slots[index]
        template_index[slot.Ref] = &slot
    }

    qslot_iter_stmt := sqlf.
        Select("*").
        From("galleryslot")

    slots := make([]StillerGallerySlot, 0, len(template_data.Slots))
    slots_err := sqlitex.ExecuteTransient(new_dbconn, qslot_iter_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            ref := stmt.GetText("slotid")
            slots = append(slots, StillerGallerySlot{
                MetatemplateSlot: *template_index[ref],
                ResId: int(stmt.GetInt64("res")),
                Title: stmt.GetText("title"),
                Description: stmt.GetText("description"),
            })

            return nil
        },

        Args: qslot_iter_stmt.Args(),
    })

    if slots_err != nil {
        return nil, slots_err
    }

    data := &StillerGalleryData{
        Origin: template_data.Origin,
        Slots: slots,
    }

    return data, nil
}

func PushNewFile(fileptr *StillerFile) error {
    new_dbconn, dbconn_err := NewConn()
    if dbconn_err != nil {
        return dbconn_err
    }

    defer CloseConn(new_dbconn)

    query_stmt := sqlf.
        InsertInto("file").
            Set("owner", fileptr.OwnerId).
            Set("type", fileptr.Typeof).
            Set("path", fileptr.Path).
            Set("filename", fileptr.Filename).
            Set("ext", fileptr.Ext).
            Set("hashed", fileptr.Hashed).
            Set("size", fileptr.Size).
            Set("deleted", fileptr.Deleted).
        Returning("id")

    query := query_stmt.String()
    query_id_res := int(-1)

    exec_err := sqlitex.ExecuteTransient(new_dbconn, query, &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            if stmt.ColumnType(0) == sqlite.TypeText {
                log.Println(stmt.ColumnText(0))
                return errors.New("pushfile error")
            }

            query_id_res = int(stmt.ColumnInt64(0))
            return nil
        },

        Args: query_stmt.Args(),
    })

    if query_id_res == -1 {
        return errors.New("no new file was added")
    }

    if exec_err != nil {
        return exec_err
    }

    fileptr.Id = query_id_res
    return nil
}

func GetUserById(id int, conn *sqlite.Conn) (StillerUser, error) {
    new_user := StillerUser{
        Id: -1,
    }

    get_user_stmt := sqlf.
        Select("*").
            From("user").
        Where("id = ?", id)

    exec_err := sqlitex.ExecuteTransient(conn, get_user_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_user = StillerUser{
                Id: int(stmt.GetInt64("id")),
                TierId: StillerTier(stmt.GetInt64("tier")),
                Displayname: stmt.GetText("displayname"),
                Username: stmt.GetText("username"),
                Mail: stmt.GetText("mail"),
                Bpasswd: stmt.GetText("bpasswd"),
            }

            return nil
        },

        Args: get_user_stmt.Args(),
    })

    if exec_err != nil {
        return StillerUser{}, exec_err
    }

    if new_user.Id == -1 {
        return StillerUser{}, ErrUserNotFound
    }

    return new_user, nil
}

func GetUserByUsername(username string, conn *sqlite.Conn) (StillerUser, error) {
    new_user := StillerUser{
        Id: -1,
    }

    get_user_stmt := sqlf.
        Select("*").
            From("user").
        Where("username = ?", username)

    exec_err := sqlitex.ExecuteTransient(conn, get_user_stmt.String(), &sqlitex.ExecOptions{
        ResultFunc: func(stmt *sqlite.Stmt) error {
            new_user = StillerUser{
                Id: int(stmt.GetInt64("id")),
                TierId: StillerTier(stmt.GetInt64("tier")),
                Displayname: stmt.GetText("displayname"),
                Username: stmt.GetText("username"),
                Mail: stmt.GetText("mail"),
                Bpasswd: stmt.GetText("bpasswd"),
            }

            return nil
        },

        Args: get_user_stmt.Args(),
    })

    if exec_err != nil {
        return StillerUser{}, exec_err
    }

    if new_user.Id == -1 {
        return StillerUser{}, ErrUserNotFound
    }

    return new_user, nil
}

type SlotUpdateFlag uint8
const (
    UPDATE_RES = iota
    UPDATE_TITLE
    UPDATE_DESCRIPTION
)

func UpdateSlot(gallery int, ref string, updater SlotUpdateFlag, newval any, conn *sqlite.Conn) error {
    base_update_stmt := sqlf.
        Update("galleryslot").
            Where("gallery = ? and slotid = ?", gallery, ref)

    switch (updater) {
    case UPDATE_RES:
        base_update_stmt.Set("res", newval.(int))
    case UPDATE_TITLE:
        base_update_stmt.Set("title", newval.(string))
    case UPDATE_DESCRIPTION:
        base_update_stmt.Set("description", newval.(string))
    }

    return sqlitex.ExecuteTransient(conn, base_update_stmt.String(), &sqlitex.ExecOptions{
        Args: base_update_stmt.Args(),
    })
}

